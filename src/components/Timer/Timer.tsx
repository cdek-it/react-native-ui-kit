import { memo, useEffect, useState } from 'react'
import { View } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'

import { makeStyles } from '../../utils/makeStyles'

import { TimerFlip } from './TimerFlip'

// eslint-disable-next-line import-x/no-deprecated
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface TimerProps {
  /**
   * Время в секундах, которое нужно отсчитать.
   * Min - 1, Max - 99
   */
  countFrom: number
  /** Функция, которая будет вызвана по завершению отсчета */
  onFinish?: () => void
}

const SIZE = 28
const BORDER_WIDTH = 2

/**
 * Таймер для использования внутри ui kit, не экспортируется для внешнего использования
 * @see https://www.figma.com/design/2ZnL6XPKEpxAHvrlbRvnMu/Template-Tailwind-CSS-(DS)?node-id=270-1514
 */
export const Timer = memo<TimerProps>(({ countFrom, onFinish }) => {
  const styles = useStyles()
  const circleAnimation = useSharedValue(0)
  const [currentTimerValue, setCurrentTimerValue] = useState(countFrom)
  const circumferenceRadius = SIZE / 2 - BORDER_WIDTH
  const circumferenceLength = 2 * Math.PI * circumferenceRadius
  const center = SIZE / 2

  const circleAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: -circleAnimation.value * circumferenceLength,
  }))

  useEffect(() => {
    setCurrentTimerValue(countFrom)
    circleAnimation.value = 0
    circleAnimation.value = withTiming(1, {
      duration: countFrom * 1000,
      easing: Easing.linear,
    })

    return () => cancelAnimation(circleAnimation)
  }, [circleAnimation, countFrom])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    if (currentTimerValue > 0) {
      timeoutId = setTimeout(
        () => setCurrentTimerValue((prev) => prev - 1),
        1000
      )
    }

    return () => clearTimeout(timeoutId)
  }, [currentTimerValue, onFinish])

  useEffect(() => {
    if (currentTimerValue === 0) {
      onFinish?.()
    }
  }, [currentTimerValue, onFinish])

  return (
    <View style={styles.container}>
      <Svg style={styles.svgContainer}>
        <AnimatedCircle
          animatedProps={circleAnimatedProps}
          cx={center}
          cy={center}
          fill='none'
          origin={[center, center]}
          r={circumferenceRadius}
          rotation={-90}
          stroke={styles.circle.color}
          strokeDasharray={circumferenceLength}
          strokeLinecap='round'
          strokeWidth={BORDER_WIDTH}
        />
      </Svg>

      <TimerFlip value={currentTimerValue} />
    </View>
  )
})

const useStyles = makeStyles(({ typography }) => ({
  container: {
    overflow: 'hidden',
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIZE,
    height: SIZE,
  },
  circle: { color: typography.Color.Surface['text-surface-0'] },
}))
