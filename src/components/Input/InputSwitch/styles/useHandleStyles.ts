import { useCallback, useEffect, useMemo } from 'react'
import { StyleSheet as RNStyleSheet } from 'react-native'
import { useSharedValue, withTiming } from 'react-native-reanimated'

import { StyleSheet } from '../../../../utils'

export const useHandleStyles = (checked: boolean) => {
  const styles = handleStyles
  const handleOnLeft = styles.handleOn.left
  const handleOffLeft = styles.handleOff.left

  const calculateHandleLeftPosition = useCallback(
    (checked: boolean) => (checked ? handleOnLeft : handleOffLeft),
    [handleOffLeft, handleOnLeft]
  )

  const calculateHandleBackground = useCallback(
    (checked: boolean) =>
      checked ? styles.handleOn.backgroundColor : styles.handle.backgroundColor,
    [styles.handle.backgroundColor, styles.handleOn.backgroundColor]
  )

  const handleLeftPosition = useSharedValue(
    calculateHandleLeftPosition(checked)
  )
  const handleBackground = useSharedValue(calculateHandleBackground(checked))

  useEffect(() => {
    handleLeftPosition.value = withTiming(calculateHandleLeftPosition(checked))
    handleBackground.value = withTiming(calculateHandleBackground(checked))
  }, [
    calculateHandleBackground,
    calculateHandleLeftPosition,
    checked,
    handleLeftPosition,
    handleBackground,
  ])

  const handleStyle = useMemo(
    () =>
      RNStyleSheet.flatten([
        styles.handle,
        { left: handleLeftPosition, backgroundColor: handleBackground },
      ]),
    [handleLeftPosition, handleBackground, styles.handle]
  )

  return { handleStyle }
}

const handleStyles = StyleSheet.create(({ theme, border }) => ({
  handle: {
    height: theme.Form.inputSwitch.inputSwitchHandleHeight,
    width: theme.Form.inputSwitch.inputSwitchHandleWidth,
    borderRadius: border.Radius['rounded-full'],
    backgroundColor: theme.Form.inputSwitch.inputSwitchHandleOffBg,
    position: 'absolute',
    top: theme.Form.inputSwitch.inputSwitchSliderPadding - border.Width.border,
  },

  handleOff: {
    backgroundColor: theme.Form.inputSwitch.inputSwitchHandleOffBg,
    left: theme.Form.inputSwitch.inputSwitchSliderPadding - border.Width.border,
  },

  handleOn: {
    backgroundColor: theme.Form.inputSwitch.inputSwitchHandleOnBg,
    left:
      theme.Form.inputSwitch.inputSwitchWidth -
      theme.Form.inputSwitch.inputSwitchSliderPadding -
      theme.Form.inputSwitch.inputSwitchHandleWidth -
      1,
  },
}))
