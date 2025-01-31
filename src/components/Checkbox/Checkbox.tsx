import { IconCheck, IconMinus } from '@tabler/icons-react-native'
import React, { memo, useCallback, useMemo } from 'react'
import {
  Pressable,
  type PressableStateCallbackType,
  StyleSheet,
  type ViewStyle,
  View,
} from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

type CheckboxState = 'default' | 'danger' | 'disabled'

export interface CheckboxProps {
  /** Обработчик нажатия на чекбокс */
  onPress: () => void
  /**
   * true, если необходим компонент в активном состоянии
   * @default false
   */
  checked?: boolean
  /**
   * true, если необходим компонент в неопределенном состоянии
   * @default false
   */
  indeterminate?: boolean
  /** Выбор состояния компонента */
  state: CheckboxState
}

export const Checkbox = memo<CheckboxProps>((props: CheckboxProps) => {
  const { state, onPress } = props
  const Icon = useIcon(props)
  const pressableStyles = usePressableStyles(props)
  const styles = useStyles()
  return (
    <View>
      {state === 'danger' && <View style={styles.outline} />}
      <Pressable
        disabled={state === 'disabled'}
        hitSlop={10}
        style={pressableStyles}
        testID='CheckboxButton_Pressable'
        onPress={onPress}
      >
        {Icon && <Icon height={styles.icon.height} style={styles.icon} width={styles.icon.width} />}
      </Pressable>
    </View>
  )
})

const usePressableStyles = (props: CheckboxProps) => {
  const styles = useStyles()
  const { checked, indeterminate, state } = props

  const styleMap = useMemo(
    () => ({
      default: {
        filled: styles.defaultFilled,
        clean: styles.defaultClean,
      },
      disabled: {
        filled: styles.disabledFilled,
        clean: styles.disabledClean,
      },
      danger: {
        filled: styles.dangerFilled,
        clean: styles.dangerClean,
      },
      hover: {
        filled: styles.hoverFilled,
        clean: styles.hoverClean,
      },
    }),
    [
      styles.defaultFilled,
      styles.defaultClean,
      styles.disabledFilled,
      styles.disabledClean,
      styles.dangerFilled,
      styles.dangerClean,
      styles.hoverFilled,
      styles.hoverClean,
    ]
  )

  return useCallback(
    ({ pressed }: PressableStateCallbackType) => {
      const isFilled = checked || indeterminate
      const result: ViewStyle[] = [styles.container]

      if (state in styleMap) {
        result.push(styleMap[state][isFilled ? 'filled' : 'clean'])
      }

      if (pressed) {
        result.push(styleMap.hover[isFilled ? 'filled' : 'clean'])
      }

      return StyleSheet.flatten(result)
    },
    [checked, indeterminate, state, styles.container, styleMap]
  )
}

const useIcon = (props: CheckboxProps) => {
  const { checked, indeterminate } = props
  return useMemo(() => {
    if (indeterminate) {
      return IconMinus
    }
    if (checked) {
      return IconCheck
    }
    return null
  }, [indeterminate, checked])
}

const useStyles = makeStyles(({ theme }) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.Form.Checkbox.checkboxWidth,
    height: theme.Form.Checkbox.checkboxHeight,
    borderRadius: 3.5,
    borderWidth: 1,
    marginLeft: theme.General.focusShadowWidth,
    marginTop: theme.General.focusShadowWidth,
  },
  outline: {
    position: 'absolute',
    width: theme.Form.Checkbox.checkboxWidth + theme.General.focusShadowWidth * 2,
    height: theme.Form.Checkbox.checkboxHeight + theme.General.focusShadowWidth * 2,
    borderRadius: 7,
    backgroundColor: theme.General.focusOutlineErrorColor,
  },
  icon: {
    height: 14,
    width: 14,
    color: theme.Form.Checkbox.checkboxIconActiveColor,
  },
  defaultClean: {
    backgroundColor: theme.Form.InputText.inputBg,
    borderColor: theme.Form.InputText.inputBorderColor,
  },
  defaultFilled: {
    backgroundColor: theme.Form.Checkbox.checkboxActiveBg,
    borderColor: theme.Form.Checkbox.checkboxActiveBorderColor,
  },
  hoverClean: {
    backgroundColor: theme.Form.InputText.inputBg,
    borderColor: theme.Form.InputText.inputHoverBorderColor,
  },
  hoverFilled: {
    backgroundColor: theme.Form.Checkbox.checkboxActiveHoverBg,
    borderColor: theme.Form.Checkbox.checkboxActiveHoverBorderColor,
  },
  dangerClean: {
    backgroundColor: theme.Form.InputText.inputBg,
    borderColor: theme.Form.InputText.inputErrorBorderColor,
  },
  dangerFilled: {
    backgroundColor: theme.Form.Checkbox.checkboxActiveBg,
    borderColor: theme.Form.InputText.inputErrorBorderColor,
  },
  disabledClean: {
    backgroundColor: theme.Button.Disabled.disabledButtonBg,
    borderColor: theme.Form.InputText.inputBorderColor,
  },
  disabledFilled: {
    backgroundColor: 'grey',
    borderColor: 'grey',
  },
}))
