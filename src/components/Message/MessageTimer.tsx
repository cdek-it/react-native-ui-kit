import { Text, View, useWindowDimensions, type TextStyle } from 'react-native'
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { decorativeProps, severityKey } from './shared'
import type { MessageSeverity } from './types'
import { useCountdown } from './useCountdown'

interface MessageTimerProps {
  readonly duration: number
  readonly onFinish?: () => void
  readonly severity: MessageSeverity
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export const MessageTimer = ({
  duration,
  onFinish,
  severity,
}: MessageTimerProps) => {
  const { progress } = useCountdown(duration, onFinish)
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%` as `${number}%`,
  }))

  return (
    <View
      {...decorativeProps}
      pointerEvents='none'
      style={styles.track}
      testID='MessageTimer'
    >
      <Animated.View
        style={[styles.fill(severity), animatedStyle]}
        testID='MessageTimerProgress'
      />
    </View>
  )
}

export const ToastMessageTimer = ({
  duration,
  onFinish,
  severity,
}: MessageTimerProps) => {
  const { remaining, progress } = useCountdown(duration, onFinish)
  const { theme } = useUnistyles()
  const { fontScale } = useWindowDimensions()
  const size = theme.components.toast.timer.size * fontScale
  const borderWidth = theme.components.toast.timer.borderWidth
  const radius = (size - borderWidth) / 2
  const circumference = 2 * Math.PI * radius
  const color =
    theme.components.toast.colorScheme[severityKey[severity]].iconColor
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: (1 - progress.value) * circumference,
  }))

  return (
    <View
      {...decorativeProps}
      style={styles.counter(size)}
      testID='ToastMessageTimer'
    >
      <Svg height={size} style={styles.circle} width={size}>
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={size / 2}
          cy={size / 2}
          fill='none'
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeWidth={borderWidth}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text
        style={styles.counterText(severity)}
        testID='ToastMessageTimerValue'
      >
        {remaining}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create(({ components, fonts }) => ({
  track: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: components.message.timer.height,
    overflow: 'hidden',
  },
  fill: (severity: MessageSeverity) => ({
    height: '100%',
    width: '100%',
    backgroundColor:
      components.message.colorScheme[severityKey[severity]].iconColor,
  }),
  counter: (size: number) => ({
    width: size,
    height: size,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  circle: { position: 'absolute' },
  counterText: (severity: MessageSeverity) => ({
    fontFamily: fonts.fontFamily.base,
    fontWeight: components.toast.summary.fontWeight as TextStyle['fontWeight'],
    fontSize: components.toast.timer.fontSize,
    color: components.toast.colorScheme[severityKey[severity]].iconColor,
  }),
}))
