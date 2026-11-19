import { useLayoutEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'

import { TooltipPortal, useTooltipHost } from './internal/TooltipContext'
import { TooltipOverlay } from './internal/TooltipOverlay'
import { measureInViewport } from './internal/measureInViewport'
import { rectsIntersect, type Rect } from './internal/placement'
import { useScreenReaderEnabled } from './internal/useScreenReaderEnabled'
import type { TooltipProps } from './types'

const VisibleTooltip = ({
  anchorRef,
  text,
  position = 'top',
  onClose,
  testID,
}: Omit<TooltipProps, 'isVisible'>) => {
  const screenReaderEnabled = useScreenReaderEnabled()
  const { fontScale } = useWindowDimensions()
  const { viewport, bounds } = useTooltipHost()
  const [measurement, setMeasurement] = useState<{
    anchor?: Rect
    pending: boolean
  }>({ pending: true })

  useLayoutEffect(() => {
    if (screenReaderEnabled !== false) {
      setMeasurement((previous) =>
        previous.anchor ? { pending: true } : previous
      )

      return
    }

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
  }, [
    anchorRef,
    text,
    position,
    viewport,
    bounds,
    fontScale,
    screenReaderEnabled,
  ])

  const { anchor, pending } = measurement

  if (
    screenReaderEnabled !== false ||
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

/**
 * Управляемая текстовая подсказка возле native View.
 *
 * Потребитель задаёт доступное имя и при необходимости accessibilityHint на якоре.
 * При включённом VoiceOver/TalkBack overlay подавляется без вызова onClose.
 * Требует TooltipProvider вокруг экрана, сохраняет фокус и открытую клавиатуру.
 * Закрывайте подсказку при уходе с экрана и программном перемещении якоря.
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=26170-69166
 */
export const Tooltip = ({ isVisible, ...props }: TooltipProps) =>
  isVisible ? <VisibleTooltip {...props} /> : null
