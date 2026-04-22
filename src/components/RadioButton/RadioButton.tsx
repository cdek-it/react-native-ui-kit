import { memo, useCallback, useState } from 'react'
import {
  type AccessibilityProps,
  Pressable,
  View,
  type ViewProps,
} from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'

import { StyleSheet } from 'react-native-unistyles'

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
        {!disabled && state === 'danger' && (
          <Animated.View
            layout={LinearTransition.duration(100)}
            style={radioStyles.outline}
          />
        )}
        <Pressable
          disabled={disabled}
          style={radioStyles.container}
          testID={testID || 'RadioButton_Pressable'}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          {...rest}
        >
          <View style={radioStyles.center} />
        </Pressable>
      </View>
    )
  }
)

const radioStyles = StyleSheet.create(({ theme }) => ({
  container: {
    width: theme.Form.RadioButton.radiobuttonWidth,
    height: theme.Form.RadioButton.radiobuttonHeight,
    borderRadius: theme.Form.RadioButton.radiobuttonWidth,
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.General.focusShadowWidth,
    variants: {
      checked: {
        true: {
          borderColor: theme.Form.RadioButton.radiobuttonActiveBorderColor,
          backgroundColor: theme.Form.RadioButton.radiobuttonActiveBorderColor,
          borderWidth: 5,
        },
        false: {
          borderColor: theme.Form.InputText.inputBorderColor,
          borderWidth: 1,
          backgroundColor: theme.Form.InputText.inputBg,
        },
      },
      pressed: {
        true: { borderColor: theme.Form.InputText.inputHoverBorderColor },
        false: {},
      },
      state: {
        danger: { borderColor: theme.Form.InputText.inputErrorBorderColor },
      },
      disabled: {
        true: {
          borderColor: theme.Form.InputText.inputBorderColor,
          backgroundColor: theme.Button.Disabled.disabledButtonBg,
          opacity: 0.6,
          borderWidth: 1,
        },
        false: {},
      },
    },
    compoundVariants: [
      {
        checked: 'true',
        pressed: 'true',
        styles: {
          borderColor: theme.Form.RadioButton.radiobuttonActiveHoverBorderColor,
          backgroundColor:
            theme.Form.RadioButton.radiobuttonActiveHoverBorderColor,
          borderWidth: 5,
        },
      },
      {
        state: 'danger',
        checked: 'true',
        styles: {
          borderColor: theme.Form.InputText.inputErrorBorderColor,
          backgroundColor: theme.Form.RadioButton.radiobuttonActiveBorderColor,
          borderWidth: 1,
        },
      },
      {
        checked: 'true',
        disabled: 'true',
        styles: {
          borderColor: theme.Form.RadioButton.radiobuttonActiveBorderColor,
          backgroundColor: theme.Form.RadioButton.radiobuttonActiveBorderColor,
          borderWidth: 5,
        },
      },
    ],
  },
  center: {
    width: theme.Form.RadioButton.radiobuttonIconSize,
    height: theme.Form.RadioButton.radiobuttonIconSize,
    borderRadius: theme.Form.RadioButton.radiobuttonIconSize,
    backgroundColor: theme.Form.InputText.inputBg,
    variants: {
      checked: { true: {}, false: {} },
      disabled: { true: {}, false: {} },
    },
    compoundVariants: [
      {
        disabled: 'true',
        checked: 'false',
        styles: { backgroundColor: 'transparent' },
      },
    ],
  },
  outline: {
    position: 'absolute',
    width:
      theme.Form.RadioButton.radiobuttonWidth +
      theme.General.focusShadowWidth * 2,
    height:
      theme.Form.RadioButton.radiobuttonHeight +
      theme.General.focusShadowWidth * 2,
    borderRadius:
      theme.Form.RadioButton.radiobuttonHeight +
      theme.General.focusShadowWidth * 2,
    backgroundColor: theme.General.focusOutlineErrorColor,
  },
}))
