import { useMemo } from 'react'

import { makeStyles } from '../../../utils/makeStyles'

export const useStateStyles = (
  checked = false,
  disabled = false,
  pressed = false,
  state = 'default'
) => {
  const styles = useStyles()
  const centerViewBackground = useMemo(
    () => [styles.defaultView, disabled && !checked && styles.disabledView],
    [disabled, checked, styles.defaultView, styles.disabledView]
  )

  const viewState = useMemo(
    () => [
      styles.default,
      pressed && styles.pressed,
      checked && styles.checked,
      checked && pressed && styles.checkedPressed,
      state === 'danger' && styles.danger,
      state === 'danger' && checked && styles.dangerChecked,
      state === 'danger' && checked && pressed && styles.dangerCheckedPressed,
      disabled && styles.disabled,
      disabled && checked && styles.disabledChecked,
    ],
    [
      checked,
      disabled,
      pressed,
      state,
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

  return useMemo(() => ({ viewState, centerViewBackground }), [viewState, centerViewBackground])
}

const useStyles = makeStyles(({ theme }) => ({
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
