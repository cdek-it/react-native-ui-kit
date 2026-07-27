import { useCallback, useEffect, useMemo } from 'react'
import { StyleSheet as RNStyleSheet } from 'react-native'
import { useSharedValue, withTiming } from 'react-native-reanimated'

import { StyleSheet } from 'react-native-unistyles'

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

const handleStyles = StyleSheet.create(({ theme }) => ({
  handle: {
    height: theme.InputSwitch.handle.size,
    width: theme.InputSwitch.handle.size,
    borderRadius: theme.InputSwitch.handle.borderRadius,
    backgroundColor: theme.InputSwitch.handle.background,
    position: 'absolute',
    top: theme.InputSwitch.gap - theme.InputSwitch.borderWidth,
  },

  handleOff: {
    backgroundColor: theme.InputSwitch.handle.background,
    left: theme.InputSwitch.gap - theme.InputSwitch.borderWidth,
  },

  handleOn: {
    backgroundColor: theme.InputSwitch.handle.checkedBackground,
    left:
      theme.InputSwitch.width -
      theme.InputSwitch.gap -
      theme.InputSwitch.handle.size -
      theme.InputSwitch.borderWidth,
  },
}))
