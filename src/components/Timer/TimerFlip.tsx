import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'

import { makeStyles } from '../../utils/makeStyles'

interface TimerFlipProps {
  readonly value: number
  readonly duration?: number
}

const SIZE = 28

export const TimerFlip: React.FC<TimerFlipProps> = ({
  value,
  duration = 300,
}) => {
  const styles = useStyles()
  const [currentValue, setCurrentValue] = useState(value)
  const [nextValue, setNextValue] = useState<number | null>(value)
  const progress = useSharedValue(0)

  const currentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * SIZE }],
    opacity: 1 - progress.value,
  }))

  const nextStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * SIZE }],
    opacity: progress.value,
    position: 'absolute',
    bottom: SIZE,
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
}

const useStyles = makeStyles(({ typography }) => ({
  container: {
    overflow: 'hidden',
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIZE,
    height: SIZE,
  },
  textWrapper: {
    height: SIZE,
    width: SIZE,
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
