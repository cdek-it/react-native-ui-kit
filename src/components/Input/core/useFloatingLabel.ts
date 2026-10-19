import { useCallback, useEffect, useState } from 'react'
import type { LayoutChangeEvent, TextInputProps } from 'react-native'
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { useInputFontScale } from './useInputFontScale'

export interface FloatingLabelMetrics {
  labelTop: number
  reducedTop: number
  labelPadding: number
  reducedPadding: number
  fontSize: number
  reducedFontSize: number
  fontFamily: string
  reducedFontFamily: string
  inputPaddingTop: number
}

export const useFloatingLabel = (
  active: boolean,
  {
    allowFontScaling,
    maxFontSizeMultiplier,
  }: Pick<TextInputProps, 'allowFontScaling' | 'maxFontSizeMultiplier'>,
  metrics: FloatingLabelMetrics
) => {
  const scale = useInputFontScale({ allowFontScaling, maxFontSizeMultiplier })
  const [labelHeight, setLabelHeight] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const animation = useSharedValue(0)

  const {
    labelTop,
    reducedTop,
    labelPadding,
    reducedPadding,
    fontSize,
    reducedFontSize,
    fontFamily,
    reducedFontFamily,
  } = metrics
  const centeredTop = containerHeight
    ? (containerHeight - labelHeight) / 2
    : labelTop

  const animatedStyle = useAnimatedStyle(() => ({
    top: interpolate(animation.value, [0, 1], [centeredTop, reducedTop]),
    paddingVertical: interpolate(
      animation.value,
      [0, 1],
      [labelPadding, reducedPadding]
    ),
    fontSize: interpolate(animation.value, [0, 1], [fontSize, reducedFontSize]),
    fontFamily: animation.value > 0.5 ? reducedFontFamily : fontFamily,
  }))

  const animatedContainerStyle = useAnimatedStyle(() => ({
    top: interpolate(animation.value, [0, 1], [centeredTop, reducedTop]),
    paddingVertical: interpolate(
      animation.value,
      [0, 1],
      [labelPadding, reducedPadding]
    ),
  }))
  const animatedTextStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(animation.value, [0, 1], [fontSize, reducedFontSize]),
    fontFamily: animation.value > 0.5 ? reducedFontFamily : fontFamily,
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

  const reservedHeight = Math.max(
    reducedFontSize * scale + reducedPadding * 2,
    labelHeight
  )

  return {
    fontScale: scale,
    animatedStyle,
    animatedContainerStyle,
    animatedTextStyle,
    onLabelLayout,
    onContainerLayout,
    inputPaddingTop: Math.max(
      metrics.inputPaddingTop,
      reducedTop + reservedHeight
    ),
  }
}
