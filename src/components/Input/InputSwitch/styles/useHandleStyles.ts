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

const handleStyles = StyleSheet.create(({ components: { toggleswitch } }) => ({
  handle: {
    height: toggleswitch.handle.size,
    width: toggleswitch.handle.size,
    borderRadius: toggleswitch.handle.borderRadius,
    backgroundColor: toggleswitch.colorScheme.handle.background,
    position: 'absolute',
    top: toggleswitch.root.gap - toggleswitch.root.borderWidth,
  },

  handleOff: {
    backgroundColor: toggleswitch.colorScheme.handle.background,
    left: toggleswitch.root.gap - toggleswitch.root.borderWidth,
  },

  handleOn: {
    backgroundColor: toggleswitch.colorScheme.handle.checkedBackground,
    left:
      toggleswitch.root.width -
      toggleswitch.root.gap -
      toggleswitch.handle.size -
      toggleswitch.root.borderWidth,
  },
}))
