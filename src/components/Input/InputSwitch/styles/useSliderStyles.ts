import { useCallback, useEffect, useMemo } from 'react'
import { type PressableStateCallbackType, StyleSheet } from 'react-native'
import { useSharedValue, withTiming } from 'react-native-reanimated'

import { makeStyles } from '../../../../utils/makeStyles'

export const useSliderStyles = (
  checked: boolean,
  disabled: boolean,
  danger: boolean
) => {
  const styles = useStyles()

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
    sliderBorderColor.value = withTiming(calculateSliderBorderColor(danger))
  }, [calculateSliderBorderColor, danger, sliderBorderColor])

  const sliderStyle = useMemo(
    () =>
      StyleSheet.flatten([
        styles.slider,
        danger && !disabled && styles.sliderDangerShadow,
        { backgroundColor: sliderBackground, borderColor: sliderBorderColor },
      ]),
    [
      danger,
      disabled,
      sliderBackground,
      sliderBorderColor,
      styles.slider,
      styles.sliderDangerShadow,
    ]
  )

  const onPressedChange = useCallback(
    ({ pressed }: PressableStateCallbackType) => {
      sliderBackground.value = withTiming(
        calculateSliderBackground(checked, disabled, pressed)
      )

      return styles.container
    },
    [
      calculateSliderBackground,
      checked,
      disabled,
      sliderBackground,
      styles.container,
    ]
  )

  return { sliderStyle, onPressedChange }
}

const useStyles = makeStyles(({ theme }) => ({
  container: {
    height: theme.Form.inputSwitch.inputSwitchHeight,
    width: theme.Form.inputSwitch.inputSwitchWidth,
  },

  slider: {
    padding: theme.Form.inputSwitch.inputSwitchSliderPadding,
    height: theme.Form.inputSwitch.inputSwitchHeight,
    width: theme.Form.inputSwitch.inputSwitchWidth,
    borderRadius: 100,
    borderWidth: 1,
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

  sliderDanger: { borderColor: theme.Form.InputText.inputErrorBorderColor },

  sliderDangerShadow: {
    shadowColor: theme.General.focusOutlineErrorColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: theme.General.focusShadowWidth,
    elevation: theme.General.focusShadowWidth,
  },
}))
