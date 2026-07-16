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
        <Animated.View pointerEvents='none' style={radioStyles.outline} />
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
    width: theme.Form.RadioButton.radiobuttonWidth,
    height: theme.Form.RadioButton.radiobuttonHeight,
    borderRadius: border.Radius['rounded-full'],
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: ['borderColor', 'backgroundColor'],
    transitionDuration: 100,
    variants: {
      checked: {
        true: {
          borderColor: theme.Form.RadioButton.radiobuttonActiveBorderColor,
          backgroundColor: theme.Form.RadioButton.radiobuttonActiveBorderColor,
        },
        false: {
          borderColor: theme.Form.InputText.inputBorderColor,
          backgroundColor: theme.Form.InputText.inputBg,
        },
      },
      pressed: { true: {}, false: {} },
      disabled: {
        true: {
          borderColor: theme.Form.InputText.inputBorderColor,
          backgroundColor: theme.Button.disabledBackground,
          opacity: 0.6,
        },
        false: {},
      },
      state: { danger: {}, default: {} },
    },
    compoundVariants: [
      {
        checked: 'true',
        pressed: 'true',
        styles: {
          borderColor: theme.Form.RadioButton.radiobuttonActiveHoverBorderColor,
          backgroundColor: theme.Form.RadioButton.radiobuttonActiveHoverBg,
        },
      },
      {
        checked: 'true',
        disabled: 'true',
        styles: {
          borderColor: theme.Form.RadioButton.radiobuttonActiveBorderColor,
          backgroundColor: theme.Form.RadioButton.radiobuttonActiveBorderColor,
        },
      },
      {
        state: 'danger',
        disabled: 'false',
        checked: 'false',
        styles: { borderColor: theme.Form.InputText.inputErrorBorderColor },
      },
      {
        checked: 'false',
        pressed: 'true',
        styles: {
          borderColor: theme.Form.RadioButton.radiobuttonActiveHoverBorderColor,
        },
      },
    ],
  },
  center: {
    width: theme.Form.RadioButton.radiobuttonIconSize,
    height: theme.Form.RadioButton.radiobuttonIconSize,
    borderRadius: border.Radius['rounded-full'],
    backgroundColor: theme.Form.InputText.inputBg,
    transitionProperty: ['opacity'],
    transitionDuration: 100,
    variants: { checked: { false: { opacity: 0 }, true: { opacity: 1 } } },
  },
  outline: {
    position: 'absolute',
    top: -theme.General.focusShadowWidth,
    left: -theme.General.focusShadowWidth,
    width:
      theme.Form.RadioButton.radiobuttonWidth +
      theme.General.focusShadowWidth * 2,
    height:
      theme.Form.RadioButton.radiobuttonHeight +
      theme.General.focusShadowWidth * 2,
    borderRadius: border.Radius['rounded-full'],
    backgroundColor: theme.General.focusOutlineErrorColor,
    transitionProperty: 'opacity',
    transitionDuration: 100,
    variants: {
      state: { danger: { opacity: 1 }, default: { opacity: 0 } },
      disabled: { true: { opacity: 0 } },
    },
  },
}))
