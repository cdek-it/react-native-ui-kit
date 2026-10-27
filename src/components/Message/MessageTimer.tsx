import { View } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import { decorativeProps, severityKey } from './shared'
import type { MessageSeverity } from './types'
import { useCountdown } from './useCountdown'

interface MessageTimerProps {
  readonly duration: number
  readonly onFinish?: () => void
  readonly severity: MessageSeverity
}

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

const styles = StyleSheet.create(({ components }) => ({
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
}))
