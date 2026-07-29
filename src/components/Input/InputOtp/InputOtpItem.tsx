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
            {value ? (
              <Text style={styles.text} testID={testID}>
                {value}
              </Text>
            ) : null}
            <Animated.Text
              accessibilityElementsHidden
              importantForAccessibility='no-hide-descendants'
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

const styles = StyleSheet.create(({ theme, border, fonts, typography }) => ({
  container: {
    minHeight: theme.Button.Common.buttonHeight,
    minWidth: theme.Button.Common.buttonHeight,
    paddingHorizontal: theme.Form.InputText.inputPaddingLeftRight,
    paddingVertical: theme.Form.InputText.inputPaddingTopBottom,
    borderBottomWidth: border.Width.border,
    borderColor: theme.Form.InputText.inputBorderColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textRow: { flexDirection: 'row', alignItems: 'center' },

  text: {
    fontSize: typography.Size['text-2xl'],
    fontFamily: fonts.primary,
    fontWeight: '400',
    color: theme.Form.InputText.inputTextColor,
    includeFontPadding: false,
  },

  pressed: { borderColor: theme.Form.InputText.inputHoverBorderColor },

  error: { borderColor: theme.Form.InputText.inputErrorBorderColor },

  disabled: { mixBlendMode: 'luminosity', opacity: 0.6 },

  cursor: { color: theme.Form.InputText.inputTextColor, marginBottom: 3 },
}))
