import { memo } from 'react'
import { View, Text, type TextStyle, type ViewProps } from 'react-native'

import Animated, { type AnimatedStyle } from 'react-native-reanimated'

import { StyleSheet } from 'react-native-unistyles'

export interface InputOtpItemProps extends Pick<ViewProps, 'testID'> {
  value?: string
  error: boolean
  pressed: boolean
  disabled: boolean
  focused: boolean
}

const CURSOR_ANIMATION_DURATION = 500

const cursorAnimationStyle = {
  animationName: { from: { opacity: 1 }, to: { opacity: 0.2 } },
  animationDuration: CURSOR_ANIMATION_DURATION,
  animationDirection: 'alternate',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease',
} satisfies AnimatedStyle<TextStyle>

export const InputOtpItem = memo<InputOtpItemProps>(
  ({ value, error, pressed, disabled, focused, testID }) => {
    return (
      <View
        style={[
          styles.container,
          error && styles.error,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        {focused ? (
          <View style={styles.textRow} testID={`${testID}CursorRow`}>
            <Text style={styles.text} testID={testID}>
              {value}
            </Text>
            <Animated.Text
              style={[styles.text, styles.cursor, cursorAnimationStyle]}
              testID={`${testID}Cursor`}
            >
              |
            </Animated.Text>
          </View>
        ) : (
          <Text style={styles.text} testID={testID}>
            {value}
          </Text>
        )}
      </View>
    )
  }
)

const styles = StyleSheet.create(({ theme, fonts, typography }) => ({
  container: {
    minHeight: 35,
    minWidth: 35,
    paddingHorizontal: theme.Input.paddingX,
    borderBottomWidth: theme.InputOtp.borderWidth,
    borderColor: theme.Input.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textRow: { flexDirection: 'row', alignItems: 'center' },

  text: {
    fontSize: typography.Size['text-2xl'],
    fontFamily: fonts.primary,
    fontWeight: '400',
    color: theme.Input.color,
    includeFontPadding: false,
  },

  pressed: { borderColor: theme.Input.hoverBorderColor },

  error: { borderColor: theme.Input.invalidBorderColor },

  disabled: { mixBlendMode: 'luminosity', opacity: 0.6 },

  cursor: { color: theme.Input.color, marginBottom: 3 },
}))
