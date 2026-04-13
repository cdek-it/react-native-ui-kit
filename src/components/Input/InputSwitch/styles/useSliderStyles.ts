import { useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet as RNStyleSheet } from 'react-native'
import { useSharedValue, withTiming } from 'react-native-reanimated'

import { StyleSheet } from '../../../../utils'

export const useSliderStyles = (
  checked: boolean,
  disabled: boolean,
  danger: boolean
) => {
  const styles = switchStyles
  const [pressed, setPressed] = useState(false)

  const calculateSliderBackground = useCallback(
    (checked: boolean, disabled: boolean, pressed: boolean) => {
      if (disabled) {
        if (checked) {
          return styles.sliderOnDisabled.backgroundColor
        }

        return styles.sliderDisabled.backgroundColor
      }

      if (pressed) {
        if (checked) {
          return styles.sliderOnPressed.backgroundColor
        }

        return styles.sliderPressed.backgroundColor
      }

      if (checked) {
        return styles.sliderOn.backgroundColor
      }

      return styles.sliderOff.backgroundColor
    },
    [
      styles.sliderDisabled.backgroundColor,
      styles.sliderOff.backgroundColor,
      styles.sliderOn.backgroundColor,
      styles.sliderOnDisabled.backgroundColor,
      styles.sliderOnPressed.backgroundColor,
      styles.sliderPressed.backgroundColor,
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

const switchStyles = StyleSheet.create(({ theme, border }) => ({
  container: {
    height: theme.Form.inputSwitch.inputSwitchHeight,
    width: theme.Form.inputSwitch.inputSwitchWidth,
  },

  slider: {
    padding: theme.Form.inputSwitch.inputSwitchSliderPadding,
    height: theme.Form.inputSwitch.inputSwitchHeight,
    width: theme.Form.inputSwitch.inputSwitchWidth,
    borderRadius: border.Radius['rounded-full'],
    borderWidth: border.Width.border,
  },

  sliderOff: { backgroundColor: theme.Form.inputSwitch.inputSwitchSliderOffBg },

  sliderOn: { backgroundColor: theme.Form.inputSwitch.inputSwitchSliderOnBg },

  sliderPressed: {
    backgroundColor: theme.Form.inputSwitch.inputSwitchSliderOffHoverBg,
  },

  sliderOnPressed: {
    backgroundColor: theme.Form.inputSwitch.inputSwitchSliderOnHoverBg,
  },

  sliderDisabled: {
    backgroundColor: theme.custom.inputSwitch.inputSwitchSliderOffDisabledBg,
  },

  sliderOnDisabled: {
    backgroundColor: theme.custom.inputSwitch.inputSwitchSliderOnDisabledBg,
  },

  sliderNoDanger: { borderColor: 'transparent' },

  sliderDanger: {
    borderColor: theme.Form.InputText.inputErrorBorderColor,
    outlineColor: theme.General.focusOutlineErrorColor,
    outlineWidth: Math.round(theme.General.focusShadowWidth),
  },
}))
