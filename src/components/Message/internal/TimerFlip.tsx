import { memo, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import Animated, {
  cancelAnimation,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'

import { StyleSheet } from 'react-native-unistyles'
import { scheduleOnRN } from 'react-native-worklets'

interface TimerFlipProps {
  readonly value: number
  readonly size: number
  readonly color: string
  readonly duration?: number
}

export const TimerFlip = memo<TimerFlipProps>(
  ({ value, size, color, duration = 300 }) => {
    const [currentValue, setCurrentValue] = useState(value)
    const progress = useSharedValue(0)

    const currentStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: progress.value * size }],
      opacity: 1 - progress.value,
    }))

    const nextStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: progress.value * size }],
      opacity: progress.value,
      bottom: size,
    }))

    useEffect(() => {
      if (value === currentValue) return

      progress.value = 0
      progress.value = withTiming(1, { duration }, (finished) => {
        if (finished) {
          scheduleOnRN(setCurrentValue, value)
        }
      })

      return () => cancelAnimation(progress)
    }, [value, currentValue, duration, progress])

    return (
      <View style={styles.container(size)}>
        <Animated.View style={[styles.textWrapper(size), nextStyle]}>
          <Text style={[styles.text, { color }]}>{value}</Text>
        </Animated.View>
        <Animated.View style={[styles.textWrapper(size), currentStyle]}>
          <Text style={[styles.text, { color }]}>{currentValue}</Text>
        </Animated.View>
      </View>
    )
  }
)

const styles = StyleSheet.create(({ components, fonts }) => ({
  container: (size: number) => ({
    overflow: 'hidden',
    width: size,
    height: size,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  }),
  textWrapper: (size: number) => ({
    height: size,
    width: size,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  }),
  text: {
    fontSize: components.message.timer.fontSize,
    fontWeight: fonts.fontWeight.bold,
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.fontFamily.base,
  },
}))
