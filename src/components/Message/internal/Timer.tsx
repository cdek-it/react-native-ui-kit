import { useEffect, useEffectEvent, useState } from 'react'
import { View, useWindowDimensions } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { type MessageSeverity, severityKey } from '../constants'
import { TimerTestId } from '../testIds'

import { TimerFlip } from './TimerFlip'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface TimerProps {
  /** Длительность отсчёта в секундах. Ожидаемый диапазон — от 0 до 99 */
  readonly countFrom: number
  /** Функция, которая будет вызвана по завершению отсчета */
  readonly onFinish?: () => void
  readonly severity?: MessageSeverity
}

/** Внутренний числовой таймер Message. */
export const Timer = ({
  countFrom,
  onFinish,
  severity = 'info',
}: TimerProps) => {
  const { theme } = useUnistyles()
  const { fontScale } = useWindowDimensions()
  const size = theme.components.message.timer.size * fontScale
  const borderWidth = theme.components.message.timer.borderWidth
  const counterColor =
    theme.components.message.colorScheme[severityKey[severity]].iconColor
  const circleAnimation = useSharedValue(0)
  const [currentTimerValue, setCurrentTimerValue] = useState(countFrom)
  const finish = useEffectEvent(() => onFinish?.())
  const radius = (size - borderWidth) / 2
  const circumference = 2 * Math.PI * radius

  const circleAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: -circleAnimation.value * circumference,
  }))

  useEffect(() => {
    if (__DEV__ && (countFrom < 0 || countFrom > 99)) {
      console.warn(
        `[Message.Timer] countFrom is expected to be in [0..99], received ${countFrom}.`
      )
    }
  }, [countFrom])

  useEffect(() => {
    circleAnimation.value = 0
    circleAnimation.value = withTiming(1, {
      duration: countFrom * 1000,
      easing: Easing.linear,
    })

    return () => cancelAnimation(circleAnimation)
  }, [circleAnimation, countFrom])

  useEffect(() => {
    setCurrentTimerValue(countFrom)
    const startedAt = Date.now()
    const interval = setInterval(() => {
      setCurrentTimerValue(
        Math.max(0, Math.ceil(countFrom - (Date.now() - startedAt) / 1000))
      )
    }, 1000)
    const timeout = setTimeout(() => {
      clearInterval(interval)
      setCurrentTimerValue(0)
      finish()
    }, countFrom * 1000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [countFrom])

  return (
    <View
      accessibilityElementsHidden
      accessible={false}
      importantForAccessibility='no-hide-descendants'
      style={styles.container(size)}
      testID={TimerTestId.Container}
    >
      <Svg height={size} style={styles.svgContainer} width={size}>
        <AnimatedCircle
          animatedProps={circleAnimatedProps}
          cx={size / 2}
          cy={size / 2}
          fill='none'
          r={radius}
          stroke={counterColor}
          strokeDasharray={circumference}
          strokeLinecap='round'
          strokeWidth={borderWidth}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <TimerFlip color={counterColor} size={size} value={currentTimerValue} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: (size: number) => ({
    overflow: 'hidden',
    width: size,
    height: size,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  svgContainer: { position: 'absolute', top: 0, left: 0 },
})
