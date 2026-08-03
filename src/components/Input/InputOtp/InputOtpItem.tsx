import { memo } from 'react'
import { View, Text, type TextStyle, type ViewProps } from 'react-native'

import Animated, { type AnimatedStyle } from 'react-native-reanimated'

import { StyleSheet } from 'react-native-unistyles'

import { effects } from '../../../theme/tokens/semantic/light.json'

export interface InputOtpItemProps extends Pick<ViewProps, 'testID'> {
  value?: string
  error: boolean
  pressed: boolean
  disabled: boolean
  focused: boolean
}

const CURSOR_ANIMATION_DURATION = 500

// Анимация не может жить в StyleSheet.create: Animated.Text из reanimated не
// принимает Unistyles-стиль. Шкала непрозрачности одинакова в обеих темах,
// поэтому токены берутся из сгенерированного файла напрямую.
const cursorAnimationStyle = {
  animationName: {
    from: { opacity: effects.opacity[100] },
    to: { opacity: effects.opacity[20] },
  },
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

// Рамка, цвет и отступы намеренно берутся у inputtext: поле OTP должно выглядеть
// как обычное поле ввода. Собственные токены inputotp описывают только отличия —
// тот же приём, что в пресете PrimeUIX lara, где inputotp задаёт лишь gap и width.
const styles = StyleSheet.create(
  ({ semantic, primitive, components, fonts }) => ({
    container: {
      minHeight: 35,
      minWidth: 35,
      paddingHorizontal: components.inputtext.root.paddingX,
      borderBottomWidth: components.inputotp.extend.borderWidth,
      borderColor: components.inputtext.root.borderColor,
      alignItems: 'center',
      justifyContent: 'center',
    },

    textRow: { flexDirection: 'row', alignItems: 'center' },

    text: {
      fontSize: primitive.fonts.fontSize[600],
      fontFamily: fonts.primary,
      fontWeight: primitive.fonts.fontWeight.regular,
      color: components.inputtext.root.color,
      includeFontPadding: false,
    },

    pressed: { borderColor: components.inputtext.root.hoverBorderColor },

    error: { borderColor: components.inputtext.root.invalidBorderColor },

    disabled: {
      mixBlendMode: 'luminosity',
      opacity: semantic.effects.opacity[60],
    },

    cursor: { color: components.inputtext.root.color, marginBottom: 3 },
  })
)
