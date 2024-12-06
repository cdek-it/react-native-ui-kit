import React, { memo, useCallback, useMemo } from 'react'
import { Pressable, type PressableStateCallbackType, StyleSheet, View } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'

import { makeStyles } from '../../utils/makeStyles'

export interface RadioButtonProps {
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
  ({ onPress, checked = false, disabled = false, state = 'default' }) => {
    const styles = useStyles()

    const centerViewBackground = useMemo(
      () => [styles.defaultView, disabled && !checked && styles.disabledView],
      [disabled, checked, styles.defaultView, styles.disabledView]
    )

    const pressableStyles = useCallback(
      ({ pressed }: PressableStateCallbackType) => {
        const result = [styles.container, styles.default]
        if (checked) {
          result.push(styles.checked)
        }
        if (pressed) {
          result.push(styles.pressed)
          if (checked) {
            result.push(styles.checkedPressed)
          }
        }
        if (state === 'danger') {
          result.push(styles.danger)
          if (checked) {
            result.push(styles.dangerChecked)
            if (pressed) {
              result.push(styles.dangerCheckedPressed)
            }
          }
        }
        if (disabled) {
          result.push(styles.disabled)
          if (checked) {
            result.push(styles.disabledChecked)
          }
        }
        return StyleSheet.flatten(result)
      },
      [
        checked,
        disabled,
        state,
        styles.container,
        styles.default,
        styles.pressed,
        styles.checked,
        styles.checkedPressed,
        styles.danger,
        styles.dangerChecked,
        styles.dangerCheckedPressed,
        styles.disabled,
        styles.disabledChecked,
      ]
    )

    return (
      <>
        {!disabled && state === 'danger' && (
          <Animated.View layout={LinearTransition.duration(100)} style={[styles.outline]} />
        )}
        <Pressable
          disabled={disabled}
          style={pressableStyles}
          testID='RadioButton_Pressable'
          onPress={onPress}
        >
          <View style={[styles.center, centerViewBackground]} />
        </Pressable>
      </>
    )
  }
)

const useStyles = makeStyles(({ theme }) => ({
  container: {
    position: 'absolute',
    width: theme.Form.RadioButton.radiobuttonWidth,
    height: theme.Form.RadioButton.radiobuttonHeight,
    borderRadius: theme.Form.RadioButton.radiobuttonWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.General.focusShadowWidth,
    marginTop: theme.General.focusShadowWidth,
  },
  center: {
    width: theme.Form.RadioButton.radiobuttonIconSize,
    height: theme.Form.RadioButton.radiobuttonIconSize,
    borderRadius: theme.Form.RadioButton.radiobuttonIconSize,
  },
  outline: {
    position: 'absolute',
    width: theme.Form.RadioButton.radiobuttonWidth + theme.General.focusShadowWidth * 2,
    height: theme.Form.RadioButton.radiobuttonHeight + theme.General.focusShadowWidth * 2,
    borderRadius: theme.Form.RadioButton.radiobuttonHeight + theme.General.focusShadowWidth * 2,
    backgroundColor: theme.General.focusOutlineErrorColor,
  },

  // centerView
  defaultView: {
    backgroundColor: theme.Form.InputText.inputBg,
  },
  disabledView: {
    backgroundColor: 'transparent',
  },

  // container viewState
  default: {
    borderColor: theme.Form.InputText.inputBorderColor,
    borderWidth: 1,
    backgroundColor: theme.Form.InputText.inputBg,
  },
  pressed: {
    borderColor: theme.Form.InputText.inputHoverBorderColor,
    backgroundColor: theme.Form.InputText.inputBg,
    borderWidth: 1,
  },
  checked: {
    borderColor: theme.Form.RadioButton.radiobuttonActiveBorderColor,
    backgroundColor: theme.Form.RadioButton.radiobuttonActiveBorderColor,
    borderWidth: 5,
  },
  checkedPressed: {
    borderColor: theme.Form.RadioButton.radiobuttonActiveHoverBorderColor,
    backgroundColor: theme.Form.RadioButton.radiobuttonActiveHoverBorderColor,
    borderWidth: 5,
  },
  // danger viewState
  danger: {
    borderColor: theme.Form.InputText.inputErrorBorderColor,
    backgroundColor: theme.Form.InputText.inputBg,
    borderWidth: 1,
  },
  dangerChecked: {
    borderColor: theme.Form.InputText.inputErrorBorderColor,
    backgroundColor: theme.Form.RadioButton.radiobuttonActiveBorderColor,
    borderWidth: 1,
  },
  dangerCheckedPressed: {
    borderColor: theme.Form.InputText.inputErrorBorderColor,
    backgroundColor: theme.Form.RadioButton.radiobuttonActiveBorderColor,
    borderWidth: 1,
  },
  // disabled viewState
  disabled: {
    borderColor: theme.Form.InputText.inputBorderColor,
    backgroundColor: theme.Button.Disabled.disabledButtonBg,
    opacity: 0.6,
    borderWidth: 1,
  },
  disabledChecked: {
    borderColor: 'grey',
    backgroundColor: 'grey',
    borderWidth: 5,
  },
}))
