import { memo, useCallback, useState } from 'react'
import {
  type AccessibilityProps,
  Pressable,
  View,
  type ViewProps,
} from 'react-native'
import Animated from 'react-native-reanimated'

import { StyleSheet } from 'react-native-unistyles'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export interface RadioButtonProps
  extends AccessibilityProps, Pick<ViewProps, 'testID'> {
  /** Обработчик нажатия на кнопку */
  onPress: () => void
  /**
   * true, если необходим компонент в активном состоянии
   * @default false
   */
  checked?: boolean
  /**
   * Управление доступностью компонента
   * @default false
   */
  disabled?: boolean
  /** Выбор состояния компонента */
  state?: 'default' | 'danger'
}

export const RadioButton = memo<RadioButtonProps>(
  ({
    onPress,
    checked = false,
    disabled = false,
    state = 'default',
    testID,
    ...rest
  }) => {
    const [pressed, setPressed] = useState(false)

    radioStyles.useVariants({
      checked: checked ? 'true' : 'false',
      pressed: pressed ? 'true' : 'false',
      state: state === 'danger' ? 'danger' : undefined,
      disabled: disabled ? 'true' : 'false',
    })

    const onPressIn = useCallback(() => setPressed(true), [])
    const onPressOut = useCallback(() => setPressed(false), [])

    return (
      <View>
        <AnimatedPressable
          disabled={disabled}
          style={radioStyles.container}
          testID={testID || 'RadioButton_Pressable'}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          {...rest}
        >
          <Animated.View style={radioStyles.center} />
        </AnimatedPressable>
      </View>
    )
  }
)

const radioStyles = StyleSheet.create(({ theme, border }) => ({
  container: {
    width: theme.RadioButton.width,
    height: theme.RadioButton.height,
    borderRadius: border.Radius['rounded-full'],
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: ['borderColor', 'backgroundColor'],
    transitionDuration: 100,
    variants: {
      checked: {
        true: {
          borderColor: theme.RadioButton.checkedBorderColor,
          backgroundColor: theme.RadioButton.checkedBackground,
        },
        false: {
          borderColor: theme.RadioButton.borderColor,
          backgroundColor: theme.RadioButton.background,
        },
      },
      pressed: { true: {}, false: {} },
      disabled: {
        true: {
          borderColor: theme.RadioButton.borderColor,
          backgroundColor: theme.RadioButton.disabledBackground,
          opacity: 0.6,
        },
        false: {},
      },
      // v2 не содержит error-outline токена для radiobutton — danger сводится к
      // смене цвета рамки на invalidBorderColor (web-only outline не переносим).
      state: { danger: {}, default: {} },
    },
    compoundVariants: [
      {
        checked: 'true',
        pressed: 'true',
        styles: {
          borderColor: theme.RadioButton.checkedHoverBorderColor,
          backgroundColor: theme.RadioButton.checkedHoverBackground,
        },
      },
      {
        checked: 'true',
        disabled: 'true',
        styles: {
          borderColor: theme.RadioButton.checkedBorderColor,
          backgroundColor: theme.RadioButton.checkedBackground,
        },
      },
      {
        state: 'danger',
        disabled: 'false',
        checked: 'false',
        styles: { borderColor: theme.RadioButton.invalidBorderColor },
      },
      {
        checked: 'false',
        pressed: 'true',
        styles: { borderColor: theme.RadioButton.hoverBorderColor },
      },
    ],
  },
  center: {
    width: theme.RadioButton.icon.size,
    height: theme.RadioButton.icon.size,
    borderRadius: border.Radius['rounded-full'],
    backgroundColor: theme.RadioButton.background,
    transitionProperty: ['opacity'],
    transitionDuration: 100,
    variants: { checked: { false: { opacity: 0 }, true: { opacity: 1 } } },
  },
}))
