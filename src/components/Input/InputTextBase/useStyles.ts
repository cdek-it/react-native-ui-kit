import { makeStyles } from '../../../utils/makeStyles'

export const useStyles = makeStyles(({ theme }) => ({
  container: {
    minHeight: 35,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: theme.General.borderRadius,
    borderColor: theme.Form.InputText.inputBorderColor,
    backgroundColor: theme.Form.InputText.inputBg,
  },
  danger: { borderColor: theme.Form.InputText.inputErrorBorderColor },
  disabled: {
    opacity: 0.6,
    borderColor: theme.Form.InputText.inputBorderColor,
    backgroundColor: theme.Button.Disabled.disabledButtonBg,
  },
  input: {
    flex: 1,
    paddingVertical: theme.Form.InputText.inputPaddingTopBottom,
    paddingHorizontal: theme.Form.InputText.inputPaddingLeftRight,
    borderRadius: theme.General.borderRadius,
    fontSize: 14,
    color: theme.Form.InputText.inputTextColor,
    overflow: 'hidden',
    includeFontPadding: false,
    verticalAlign: 'middle',
  },
  placeholderTextColor: {
    color: theme.Form.InputText.inputPlaceholderTextColor,
  },
  outline: { position: 'absolute' },
  outlineWidth: { borderWidth: theme.General.focusShadowWidth },
  focusOutline: { backgroundColor: theme.General.focusOutlineColor },
  dangerOutline: { backgroundColor: theme.General.focusOutlineErrorColor },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: theme.Form.InputText.inputPaddingLeftRight,
    maxHeight: 54,
    gap: theme.Form.InputText.inputPaddingLeftRight,
    overflow: 'hidden',
  },
  rightIcon: { color: theme.Form.InputText.inputIconColor },
  iconSize: { width: 14, height: 14 },
}))
