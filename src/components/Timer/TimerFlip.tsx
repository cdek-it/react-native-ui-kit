import React, { memo, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'

import { makeStyles } from '../../utils/makeStyles'
import { COUNTER_SIZE } from './constants'

interface TimerFlipProps {
  readonly value: number
  readonly duration?: number
}

export const TimerFlip =memo<TimerFlipProps>( ({
  value,
  duration = 300,
}) => {
  const styles = useStyles()
  const [currentValue, setCurrentValue] = useState(value)
  const [nextValue, setNextValue] = useState<number | null>(value)
  const progress = useSharedValue(0)

  const currentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * COUNTER_SIZE }],
    opacity: 1 - progress.value,
  }))

  const nextStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * COUNTER_SIZE }],
    opacity: progress.value,
    bottom: COUNTER_SIZE,
  }))

  useEffect(() => {
    if (nextValue === currentValue && value !== currentValue) {
      setNextValue(null)
      progress.value = 0
    }
  }, [currentValue, nextValue, progress, value])

  useEffect(() => {
    if (value === currentValue || nextValue !== null) return

    setNextValue(value)
    progress.value = withTiming(1, { duration }, (finished) => {
      if (finished) {
        runOnJS(setCurrentValue)(value)
      }
    })
  }, [value, currentValue, duration, progress, nextValue])

  return (
    <View style={styles.container}>
      {nextValue !== null && (
        <Animated.View style={[styles.textWrapper, nextStyle]}>
          <Text style={styles.text}>{nextValue}</Text>
        </Animated.View>
      )}
      <Animated.View style={[styles.textWrapper, currentStyle]}>
        <Text style={styles.text}>{currentValue}</Text>
      </Animated.View>
    </View>
  )
})

const useStyles = makeStyles(({ typography }) => ({
  container: {
    overflow: 'hidden',
    width: COUNTER_SIZE,
    height: COUNTER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  textWrapper: {
    height: COUNTER_SIZE,
    width: COUNTER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  text: {
    fontSize: typography.Size['text-base'],
    fontWeight: 700,
    includeFontPadding: false,
    verticalAlign: 'middle',
    color: typography.Color.Surface['text-surface-0'],
  },
}))
