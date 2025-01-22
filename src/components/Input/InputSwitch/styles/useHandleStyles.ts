import { useCallback, useEffect, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { useSharedValue, withTiming } from 'react-native-reanimated'

import { makeStyles } from '../../../../utils/makeStyles'

export const useHandleStyles = (checked: boolean) => {
  const styles = useStyles()

  const calculateHandleLeftPosition = useCallback(
    (checked: boolean) => (checked ? styles.handleOn.left : styles.handleOff.left),
    [styles.handleOff.left, styles.handleOn.left]
  )

  const calculateHandleBackground = useCallback(
    (checked: boolean) =>
      checked ? styles.handleOn.backgroundColor : styles.handle.backgroundColor,
    [styles.handle.backgroundColor, styles.handleOn.backgroundColor]
  )

  const handleLeftPosition = useSharedValue(calculateHandleLeftPosition(checked))
  const handlerBackgrouind = useSharedValue(calculateHandleBackground(checked))

  useEffect(() => {
    handleLeftPosition.value = withTiming(calculateHandleLeftPosition(checked))
    handlerBackgrouind.value = withTiming(calculateHandleBackground(checked))
  }, [
    calculateHandleBackground,
    calculateHandleLeftPosition,
    checked,
    handleLeftPosition,
    handlerBackgrouind,
  ])

  const handleStyle = useMemo(
    () =>
      StyleSheet.flatten([
        styles.handle,
        { left: handleLeftPosition, backgroundColor: handlerBackgrouind },
      ]),
    [handleLeftPosition, handlerBackgrouind, styles.handle]
  )

  return { handleStyle }
}

const useStyles = makeStyles(({ theme }) => ({
  handle: {
    height: theme.Form.inputSwitch.inputSwitchHandleHeight,
    width: theme.Form.inputSwitch.inputSwitchHandleWidth,
    borderRadius: 100,
    backgroundColor: theme.Form.inputSwitch.inputSwitchHandleOffBg,
    position: 'absolute',
    top: theme.Form.inputSwitch.inputSwitchSliderPadding - 1,
  },

  handleOff: {
    backgroundColor: theme.Form.inputSwitch.inputSwitchHandleOffBg,
    left: theme.Form.inputSwitch.inputSwitchSliderPadding - 1,
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
