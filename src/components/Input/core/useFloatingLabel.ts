import { useCallback, useEffect, useState } from 'react'
import type { LayoutChangeEvent, TextInputProps } from 'react-native'
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { styles } from './styles'
import { useInputFontScale } from './useInputFontScale'

export const useFloatingLabel = (
  active: boolean,
  nativeProps: Pick<
    TextInputProps,
    'allowFontScaling' | 'maxFontSizeMultiplier'
  >
) => {
  const scale = useInputFontScale(nativeProps)
  const [labelHeight, setLabelHeight] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const animation = useSharedValue(0)

  const label = styles.floatText(false)
  const fontSize = label.fontSize
  const lineHeight = label.lineHeight
  const reducedFontSize = styles.floatReduced.fontSize
  const reducedLineHeight = styles.floatReduced.lineHeight
  const reducedTop = styles.floatReduced.top
  const centeredOffset = (reducedTop - styles.floatInput.paddingBottom) / 2
  const centeredTop = containerHeight
    ? (containerHeight - labelHeight) / 2 + centeredOffset
    : styles.floatLabel.top

  const animatedContainerStyle = useAnimatedStyle(() => ({
    top: interpolate(animation.value, [0, 1], [centeredTop, reducedTop]),
  }))
  const animatedTextStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(animation.value, [0, 1], [fontSize, reducedFontSize]),
    lineHeight: interpolate(
      animation.value,
      [0, 1],
      [lineHeight, reducedLineHeight]
    ),
  }))

  useEffect(() => {
    animation.value = withTiming(active ? 1 : 0, { duration: 100 })
  }, [active, animation])

  const onLabelLayout = useCallback((event: LayoutChangeEvent) => {
    setLabelHeight(event.nativeEvent.layout.height)
  }, [])
  const onContainerLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerHeight(event.nativeEvent.layout.height)
  }, [])

  const reducedHeight = reducedLineHeight * scale
  const reservedHeight =
    scale <= 1 ? reducedHeight : Math.max(reducedHeight, labelHeight)

  return {
    fontScale: scale,
    animatedContainerStyle,
    animatedTextStyle,
    onLabelLayout,
    onContainerLayout,
    inputPaddingTop: Math.max(
      styles.floatInput.paddingTop,
      reducedTop + reservedHeight
    ),
  }
}
