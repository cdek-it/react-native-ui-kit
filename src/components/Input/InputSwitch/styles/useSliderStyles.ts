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
    []
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
