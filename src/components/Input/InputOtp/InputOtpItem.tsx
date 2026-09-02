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
              <>
                <Text
                  accessibilityElementsHidden
                  importantForAccessibility='no-hide-descendants'
                  style={[styles.text, styles.cursorSpacer]}
                >
                  |
                </Text>
                <Text style={styles.text} testID={testIds.item}>
                  {value}
                </Text>
              </>
            ) : null}
            <Animated.Text
              accessibilityElementsHidden
              importantForAccessibility='no-hide-descendants'
              style={[styles.text, cursorAnimationStyle]}
              testID={testIds.cursor}
            >
              |
            </Animated.Text>
          </View>
        ) : (
          <Text style={styles.text} testID={testIds.item}>
            {value}
          </Text>
        )}
      </Pressable>
    )
  }
)

const styles = StyleSheet.create(({ components, semantic, fonts }) => ({
  container: {
    width: components.inputotp.input.width,
    height: components.inputotp.extend.height,
    paddingHorizontal: components.inputtext.root.paddingX,
    paddingTop: components.inputotp.input.paddingTop,
    paddingBottom: components.inputotp.input.paddingBottom,
    borderWidth: components.inputotp.extend.borderWidth,
    borderRadius: components.inputtext.root.borderRadius,
    borderColor: components.inputtext.root.borderColor,
    backgroundColor: components.inputtext.root.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textRow: { flexDirection: 'row', alignItems: 'center' },

  cursorSpacer: { opacity: semantic.effects.opacity[0] },

  text: {
    fontSize: fonts.fontSize[200],
    lineHeight: fonts.fontSize[200],
    fontFamily: fonts.fontFamily.heading,
    fontWeight: fonts.fontWeight.regular,
    letterSpacing: fonts.letterSpacing[500],
    color: components.inputtext.root.color,
    includeFontPadding: false,
    textAlign: 'center',
  },

  hovered: { borderColor: components.inputtext.root.hoverBorderColor },

  focused: {
    borderColor: components.inputtext.root.focusBorderColor,
    boxShadow: `0 0 0 ${components.inputtext.root.focusRing.width}px ${components.inputtext.root.focusRing.color}`,
  },

  error: {
    borderColor: semantic.colorScheme.color.border.status.danger.strong,
  },

  errorFocused: {
    boxShadow: `0 0 0 3.5px ${semantic.colorScheme.color.bg.status.danger.weak.hover}`,
  },

  disabled: {
    backgroundColor: components.inputtext.root.disabledBackground,
    borderColor: components.inputtext.root.borderColor,
    boxShadow: 'none',
    opacity: semantic.effects.opacity[50],
  },
}))
