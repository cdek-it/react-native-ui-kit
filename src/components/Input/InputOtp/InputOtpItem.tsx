import { memo, useState } from 'react'
import {
  Pressable,
  View,
  Text,
  type PressableProps,
  type TextProps,
  type TextStyle,
} from 'react-native'

import Animated, { type AnimatedStyle } from 'react-native-reanimated'

import { StyleSheet } from 'react-native-unistyles'

import effects from '../../../theme/tokens/semantic/effects.json'

import { createInputOtpTestIds } from './testIds'

export interface InputOtpItemProps
  extends
    Pick<PressableProps, 'onPress' | 'testOnly_pressed'>,
    Pick<TextProps, 'allowFontScaling' | 'maxFontSizeMultiplier'> {
  value?: string
  error: boolean
  disabled: boolean
  focused: boolean
  testIdPrefix: string
}

const CURSOR_ANIMATION_DURATION = 500

const createFocusRingShadow = (
  ringWidth: number,
  ringColor: string,
  borderWidth: number,
  borderColor: string
) => `0 0 0 ${ringWidth}px ${ringColor}, 0 0 0 ${borderWidth}px ${borderColor}`

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
    allowFontScaling,
    maxFontSizeMultiplier,
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
        <View style={styles.content}>
          {focused ? (
            <View style={styles.textRow} testID={testIds.cursorRow}>
              {value ? (
                <>
                  <Text
                    accessibilityElementsHidden
                    allowFontScaling={allowFontScaling}
                    importantForAccessibility='no-hide-descendants'
                    maxFontSizeMultiplier={maxFontSizeMultiplier}
                    style={[styles.text, styles.cursorSpacer]}
                  >
                    |
                  </Text>
                  <Text
                    allowFontScaling={allowFontScaling}
                    maxFontSizeMultiplier={maxFontSizeMultiplier}
                    style={styles.text}
                    testID={testIds.item}
                  >
                    {value}
                  </Text>
                </>
              ) : null}
              <Animated.Text
                accessibilityElementsHidden
                allowFontScaling={allowFontScaling}
                importantForAccessibility='no-hide-descendants'
                maxFontSizeMultiplier={maxFontSizeMultiplier}
                style={[styles.text, cursorAnimationStyle]}
                testID={testIds.cursor}
              >
                |
              </Animated.Text>
            </View>
          ) : (
            <Text
              allowFontScaling={allowFontScaling}
              maxFontSizeMultiplier={maxFontSizeMultiplier}
              style={styles.text}
              testID={testIds.item}
            >
              {value}
            </Text>
          )}
        </View>
      </Pressable>
    )
  }
)

const styles = StyleSheet.create(({ components, semantic, fonts }) => ({
  container: {
    width: components.inputotp.input.width,
    height: components.inputotp.extend.height,
    paddingHorizontal: components.inputtext.root.paddingX,
    paddingVertical: components.inputtext.root.paddingY,
    borderWidth: components.inputotp.extend.borderWidth,
    borderRadius: components.inputtext.root.borderRadius,
    borderColor: components.inputtext.root.borderColor,
    backgroundColor: components.inputtext.root.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textRow: { flexDirection: 'row', alignItems: 'center' },

  cursorSpacer: { opacity: semantic.effects.opacity[0] },

  text: {
    fontSize: fonts.fontSize[200],
    lineHeight: fonts.lineHeight[300],
    fontFamily: fonts.fontFamily.base,
    fontWeight: fonts.fontWeight.regular,
    letterSpacing: fonts.letterSpacing[500],
    color: components.inputtext.root.color,
    includeFontPadding: false,
    textAlign: 'center',
  },

  hovered: { borderColor: components.inputtext.root.hoverBorderColor },

  focused: {
    borderWidth: 0,
    boxShadow: createFocusRingShadow(
      components.inputtext.root.focusRing.width,
      components.inputtext.root.focusRing.color,
      components.inputotp.extend.borderWidth,
      components.inputtext.root.focusBorderColor
    ),
  },

  error: { borderColor: components.inputtext.root.invalidBorderColor },

  errorFocused: {
    boxShadow: createFocusRingShadow(
      components.inputtext.root.focusRing.width,
      semantic.colorScheme.color.border.status.danger.focus,
      components.inputotp.extend.borderWidth,
      components.inputtext.root.invalidBorderColor
    ),
  },

  disabled: {
    borderWidth: components.inputotp.extend.borderWidth,
    backgroundColor: components.inputtext.root.disabledBackground,
    borderColor: components.inputtext.root.borderColor,
    boxShadow: 'none',
    opacity: semantic.effects.opacity[50],
  },
}))
