import { useCallback, useEffect, useState } from 'react'
import type { LayoutChangeEvent, TextInputProps } from 'react-native'
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { useInputFontScale } from '../../core/useInputFontScale'

import { inputStyles as styles } from './useInputStyles'

export const useLegacyFloatingLabel = (
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
  const reducedTop = styles.labelReducedSize.top
  const labelPadding = styles.label.paddingVertical
  const reducedPadding = styles.labelReducedSize.paddingVertical
  const fontSize = styles.label.fontSize
  const reducedFontSize = styles.labelReducedSize.fontSize
  const fontFamily = styles.label.fontFamily
  const reducedFontFamily = styles.labelReducedSize.fontFamily
  const centeredTop = containerHeight
    ? (containerHeight - labelHeight) / 2
    : styles.label.top

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
    animatedStyle,
    onLabelLayout,
    onContainerLayout,
    inputPaddingTop: Math.max(
      styles.floatLabelInput.paddingTop,
      reducedTop + reservedHeight
    ),
  }
}
