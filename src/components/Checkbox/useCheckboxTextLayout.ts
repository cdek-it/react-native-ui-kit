import { useCallback, useState } from 'react'
import type { TextLayoutEvent } from 'react-native'

export const useCheckboxTextLayout = (label?: string, caption?: string) => {
  const [labelFirstLineHeight, setLabelFirstLineHeight] = useState(0)
  const [multilineLabel, setMultilineLabel] = useState(false)
  const [multilineCaption, setMultilineCaption] = useState(false)
  const visibleCaption = label === undefined ? undefined : caption
  const alignToFirstLine =
    label !== undefined &&
    (multilineLabel || (visibleCaption !== undefined && multilineCaption))
  const firstLineHeight = alignToFirstLine ? labelFirstLineHeight : 0

  const onLabelTextLayout = useCallback(
    ({ nativeEvent: { lines } }: TextLayoutEvent) => {
      setMultilineLabel(lines.length > 1)
      setLabelFirstLineHeight(lines[0]?.height ?? 0)
    },
    []
  )
  const onCaptionTextLayout = useCallback(
    ({ nativeEvent: { lines } }: TextLayoutEvent) => {
      setMultilineCaption(lines.length > 1)
    },
    []
  )

  return {
    visibleCaption,
    alignToFirstLine,
    firstLineHeight,
    onLabelTextLayout,
    onCaptionTextLayout,
  }
}
