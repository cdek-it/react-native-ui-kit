import { useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet as RNStyleSheet } from 'react-native'
import { useSharedValue, withTiming } from 'react-native-reanimated'

import { StyleSheet } from 'react-native-unistyles'

export const useSliderStyles = (
  checked: boolean,
  disabled: boolean,
  danger: boolean
) => {
  const styles = switchStyles
  const [pressed, setPressed] = useState(false)

  const sliderDisabledBg = styles.sliderDisabled.backgroundColor
  const sliderOffBg = styles.sliderOff.backgroundColor
  const sliderOnBg = styles.sliderOn.backgroundColor
  const sliderOnDisabledBg = styles.sliderOnDisabled.backgroundColor
  const sliderOnPressedBg = styles.sliderOnPressed.backgroundColor
  const sliderPressedBg = styles.sliderPressed.backgroundColor
  const calculateSliderBackground = useCallback(
    (checked: boolean, disabled: boolean, pressed: boolean): string => {
      if (disabled) {
        if (checked) {
          return sliderOnDisabledBg
        }

        return sliderDisabledBg
      }

      if (pressed) {
        if (checked) {
          return sliderOnPressedBg
        }

        return sliderPressedBg
      }

      if (checked) {
        return sliderOnBg
      }

      return sliderOffBg
    },
    [
      sliderDisabledBg,
      sliderOffBg,
      sliderOnBg,
      sliderOnDisabledBg,
      sliderOnPressedBg,
      sliderPressedBg,
    ]
  )

  const calculateSliderBorderColor = useCallback(
    (danger: boolean) => {
      if (danger && !disabled) {
        return styles.sliderDanger.borderColor
      }

      return styles.sliderNoDanger.borderColor
    },
    [
      disabled,
      styles.sliderDanger.borderColor,
      styles.sliderNoDanger.borderColor,
    ]
  )

  const sliderBackground = useSharedValue(
    calculateSliderBackground(checked, disabled, false)
  )
  const sliderBorderColor = useSharedValue(calculateSliderBorderColor(danger))

  useEffect(() => {
    sliderBackground.value = withTiming(
      calculateSliderBackground(checked, disabled, pressed)
    )
  }, [calculateSliderBackground, checked, disabled, pressed, sliderBackground])

  useEffect(() => {
    sliderBorderColor.value = withTiming(calculateSliderBorderColor(danger))
  }, [calculateSliderBorderColor, danger, sliderBorderColor])

  const sliderStyle = useMemo(
    () =>
      RNStyleSheet.flatten([
        styles.slider,
        { backgroundColor: sliderBackground, borderColor: sliderBorderColor },
      ]),
    [sliderBackground, sliderBorderColor, styles.slider]
  )

  const onPressIn = useCallback(() => setPressed(true), [])
  const onPressOut = useCallback(() => setPressed(false), [])

  return {
    containerStyle: styles.container,
    sliderStyle,
    onPressIn,
    onPressOut,
  }
}

const switchStyles = StyleSheet.create(({ components: { toggleswitch } }) => ({
  container: {
    height: toggleswitch.root.height,
    width: toggleswitch.root.width,
  },

  slider: {
    padding: toggleswitch.root.gap,
    height: toggleswitch.root.height,
    width: toggleswitch.root.width,
    borderRadius: toggleswitch.root.borderRadius,
    borderWidth: toggleswitch.root.borderWidth,
  },

  sliderOff: { backgroundColor: toggleswitch.colorScheme.root.background },

  sliderOn: {
    backgroundColor: toggleswitch.colorScheme.root.checkedBackground,
  },

  sliderPressed: {
    backgroundColor: toggleswitch.colorScheme.root.hoverBackground,
  },

  sliderOnPressed: {
    backgroundColor: toggleswitch.colorScheme.root.checkedHoverBackground,
  },

  sliderDisabled: {
    backgroundColor: toggleswitch.colorScheme.root.disabledBackground,
  },

  sliderOnDisabled: {
    backgroundColor: toggleswitch.colorScheme.root.disabledBackground,
  },

  sliderNoDanger: { borderColor: toggleswitch.root.borderColor },

  sliderDanger: { borderColor: toggleswitch.root.invalidBorderColor },
}))
