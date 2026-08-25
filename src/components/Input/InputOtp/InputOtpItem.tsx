import { memo, useState } from 'react'
import {
  Pressable,
  View,
  Text,
  type PressableProps,
  type TextStyle,
} from 'react-native'

import Animated, { type AnimatedStyle } from 'react-native-reanimated'

import { StyleSheet } from 'react-native-unistyles'

import effects from '../../../theme/tokens/semantic/effects.json'

import { createInputOtpTestIds } from './testIds'

export interface InputOtpItemProps extends Pick<
  PressableProps,
  'onPress' | 'testOnly_pressed'
> {
  value?: string
  error: boolean
  disabled: boolean
  focused: boolean
  testIdPrefix: string
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
  ({
    value,
    error,
    disabled,
    focused,
    testIdPrefix,
    testOnly_pressed,
    onPress,
  }) => {
    const [isHovered, setIsHovered] = useState(false)
    const testIds = createInputOtpTestIds(testIdPrefix)

    return (
      <Pressable
        accessible={false}
        disabled={disabled}
        style={({ pressed }) => [
          styles.container,
          (pressed || isHovered) && styles.hovered,
          focused && styles.focused,
          error && styles.error,
          error && focused && styles.errorFocused,
          disabled && styles.disabled,
        ]}
        testID={testIds.itemContainer}
        testOnly_pressed={testOnly_pressed}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPress={onPress}
      >
        {focused ? (
          <View style={styles.textRow} testID={testIds.cursorRow}>
            {value ? (
              <Text
                style={[styles.text, disabled && styles.disabledText]}
                testID={testIds.item}
              >
                {value}
              </Text>
            ) : null}
            <Animated.Text
              accessibilityElementsHidden
              importantForAccessibility='no-hide-descendants'
              style={[
                styles.text,
                disabled && styles.disabledText,
                cursorAnimationStyle,
              ]}
              testID={testIds.cursor}
            >
              |
            </Animated.Text>
          </View>
        ) : (
          <Text
            style={[styles.text, disabled && styles.disabledText]}
            testID={testIds.item}
          >
            {value}
          </Text>
        )}
      </Pressable>
    )
  }
)

const styles = StyleSheet.create(({ components, semantic, fonts }) => ({
  container: {
    minWidth: components.inputotp.extend.height,
    minHeight: components.inputotp.extend.height,
    borderWidth: components.inputotp.extend.borderWidth,
    borderRadius: components.inputtext.root.borderRadius,
    borderColor: semantic.colorScheme.color.border.neutral.strong,
    backgroundColor: semantic.colorScheme.color.bg.surface.default.default,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textRow: { flexDirection: 'row', alignItems: 'center' },

  text: {
    fontSize: fonts.fontSize[200],
    lineHeight: fonts.lineHeight[200],
    fontFamily: fonts.fontFamily.base,
    fontWeight: fonts.fontWeight.regular,
    color: semantic.colorScheme.color.fg.active,
    includeFontPadding: false,
    textAlign: 'center',
  },

  hovered: { borderColor: semantic.colorScheme.color.border.brand.strong },

  focused: {
    borderColor: semantic.colorScheme.color.border.brand.strong,
    boxShadow: `0 0 0 3.5px ${semantic.colorScheme.color.border.focus}`,
  },

  error: {
    borderColor: semantic.colorScheme.color.border.status.danger.strong,
  },

  errorFocused: {
    boxShadow: `0 0 0 3.5px ${semantic.colorScheme.color.bg.status.danger.weak.hover}`,
  },

  disabled: {
    backgroundColor: semantic.colorScheme.color.bg.neutral.weak.disabled,
    borderColor: semantic.colorScheme.color.border.neutral.strong,
    boxShadow: 'none',
    opacity: semantic.effects.opacity[50],
  },

  disabledText: { color: semantic.colorScheme.color.fg.muted },
}))
