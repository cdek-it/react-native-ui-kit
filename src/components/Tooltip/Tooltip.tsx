import { useLayoutEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'

import { TooltipOverlay } from './internal/TooltipOverlay'
import { measureInViewport } from './internal/measureInViewport'
import {
  getTooltipBounds,
  rectsIntersect,
  type Rect,
} from './internal/placement'
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
  const { width, height, fontScale } = useWindowDimensions()
  const { theme, rt } = useUnistyles()
  const [measurement, setMeasurement] = useState<{
    anchor?: Rect
    bounds?: Rect
    pending: boolean
  }>({ pending: true })

  const { top, bottom, left, right } = rt.insets
  const gutter = theme.components.tooltip.root.gutter

  useLayoutEffect(() => {
    if (screenReaderEnabled !== false) {
      setMeasurement((previous) =>
        previous.anchor ? { pending: true } : previous
      )

      return
    }

    let active = true
    const node = anchorRef.current

    if (!node) {
      setMeasurement({ pending: false })

      return
    }

    const bounds = getTooltipBounds(
      { width, height },
      { top, bottom, left, right },
      gutter
    )
    setMeasurement((previous) => ({ ...previous, pending: true }))
    measureInViewport(node, (rect) => {
      if (active)
        setMeasurement({
          anchor: rect.width > 0 && rect.height > 0 ? rect : undefined,
          bounds,
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
    width,
    height,
    fontScale,
    screenReaderEnabled,
    top,
    bottom,
    left,
    right,
    gutter,
  ])

  const { anchor, bounds, pending } = measurement

  if (
    screenReaderEnabled !== false ||
    !anchor ||
    !bounds ||
    !rectsIntersect(bounds, anchor)
  )
    return null

  return (
    <TooltipOverlay
      anchor={anchor}
      fontScale={fontScale}
      isMeasuring={pending}
      position={position}
      testID={testID}
      text={text}
      onClose={onClose}
    />
  )
}

/**
 * Управляемая текстовая подсказка возле native View.
 *
 * Потребитель задаёт доступное имя и при необходимости accessibilityHint на якоре.
 * При включённом VoiceOver/TalkBack overlay подавляется без вызова onClose.
 * На iOS открытие подсказки скрывает экранную клавиатуру.
 * Закрывайте подсказку при уходе с экрана и программном перемещении якоря.
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=26170-69166
 */
export const Tooltip = ({ isVisible, ...props }: TooltipProps) =>
  isVisible ? <VisibleTooltip {...props} /> : null
