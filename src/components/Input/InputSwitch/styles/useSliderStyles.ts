import { useCallback, useEffect, useMemo } from 'react'
import { type PressableStateCallbackType, StyleSheet } from 'react-native'
import { useSharedValue, withTiming } from 'react-native-reanimated'

import { makeStyles } from '../../../../utils/makeStyles'

export const useSliderStyles = (checked: boolean, disabled: boolean, danger: boolean) => {
  const styles = useStyles()

  const calculateSliderBackground = useCallback(
    (checked: boolean, disabled: boolean, pressed: boolean) => {
      if (disabled) {
        if (checked) {
          return styles.sliderOnDisabled.backgroundColor
        } else {
          return styles.sliderDisabled.backgroundColor
        }
      } else if (pressed) {
        if (checked) {
          return styles.sliderOnPressed.backgroundColor
        } else {
          return styles.sliderPressed.backgroundColor
        }
      } else if (checked) {
        return styles.sliderOn.backgroundColor
      } else {
        return styles.sliderOff.backgroundColor
      }
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
      if (danger) {
        return styles.sliderDanger.borderColor
      }
      return styles.sliderNoDanger.borderColor
    },
    [styles.sliderDanger.borderColor, styles.sliderNoDanger.borderColor]
  )

  const sliderBackground = useSharedValue(calculateSliderBackground(checked, disabled, false))
  const sliderBorderColor = useSharedValue(calculateSliderBorderColor(danger))

  const sliderStyle = useMemo(
    () =>
      StyleSheet.flatten([
        styles.slider,
        { backgroundColor: sliderBackground, borderColor: sliderBorderColor },
      ]),
    [sliderBackground, sliderBorderColor, styles.slider]
  )

  const onPressedChange = useCallback(
    ({ pressed }: PressableStateCallbackType) => {
      sliderBackground.value = withTiming(calculateSliderBackground(checked, disabled, pressed))

      return styles.container
    },
    [calculateSliderBackground, checked, disabled, sliderBackground, styles.container]
  )

  useEffect(() => {
    sliderBorderColor.value = withTiming(calculateSliderBorderColor(danger))
  }, [calculateSliderBorderColor, danger, sliderBorderColor])

  return {
    sliderStyle,
    onPressedChange,
  }
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

  sliderOff: {
    backgroundColor: theme.Form.inputSwitch.inputSwitchSliderOffBg,
  },

  sliderOn: {
    backgroundColor: theme.Form.inputSwitch.inputSwitchSliderOnBg,
  },

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

  sliderNoDanger: {
    borderColor: 'transparent',
  },

  sliderDanger: {
    borderColor: theme.Form.InputText.inputErrorBorderColor,
  },
}))
