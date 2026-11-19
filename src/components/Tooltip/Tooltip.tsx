import { useLayoutEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'

import { TooltipPortal, useTooltipHost } from './internal/TooltipContext'
import { TooltipOverlay } from './internal/TooltipOverlay'
import { measureInViewport } from './internal/measureInViewport'
import { rectsIntersect, type Rect } from './internal/placement'
import type { TooltipProps } from './types'

const VisibleTooltip = ({
  anchorRef,
  text,
  position = 'top',
  onClose,
  testID,
}: Omit<TooltipProps, 'isVisible'>) => {
  const { fontScale } = useWindowDimensions()
  const { viewport, bounds } = useTooltipHost()
  const [measurement, setMeasurement] = useState<{
    anchor?: Rect
    pending: boolean
  }>({ pending: true })

  useLayoutEffect(() => {
    let active = true
    const node = anchorRef.current

    if (!node || !viewport || !bounds) {
      setMeasurement({ pending: false })

      return
    }

    setMeasurement((previous) => ({ ...previous, pending: true }))
    measureInViewport(node, (rect) => {
      if (active)
        setMeasurement({
          anchor: rect.width > 0 && rect.height > 0 ? rect : undefined,
          pending: false,
        })
    })

    return () => {
      active = false
    }
  }, [anchorRef, text, position, viewport, bounds, fontScale])

  const { anchor, pending } = measurement

  if (
    !anchor ||
    !viewport ||
    !bounds ||
    bounds.width <= 0 ||
    bounds.height <= 0 ||
    !rectsIntersect(bounds, {
      ...anchor,
      x: anchor.x - viewport.x,
      y: anchor.y - viewport.y,
    })
  )
    return null

  return (
    <TooltipPortal>
      <TooltipOverlay
        anchor={anchor}
        bounds={bounds}
        fontScale={fontScale}
        isMeasuring={pending}
        position={position}
        testID={testID}
        text={text}
        viewport={viewport}
        onClose={onClose}
      />
    </TooltipPortal>
  )
}

/** Управляемая текстовая подсказка возле native View. Требует TooltipProvider. */
export const Tooltip = ({ isVisible, ...props }: TooltipProps) =>
  isVisible ? <VisibleTooltip {...props} /> : null
