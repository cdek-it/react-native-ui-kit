import { makeStyles } from '../../../utils/makeStyles'

export const useStyles = makeStyles(
  ({ theme, border, typography, spacing, fonts }) => ({
    container: {
      minHeight: theme.Button.Common.buttonHeight,
      flexDirection: 'row',
      borderWidth: border.Width.border,
      borderRadius: border.Radius['rounded-xl'],
      borderColor: theme.Form.InputText.inputBorderColor,
      backgroundColor: theme.Form.InputText.inputBg,
      justifyContent: 'center',
    },
    containerFocused: {
      outlineColor: theme.General.focusOutlineColor,
      outlineWidth: Math.round(theme.General.focusShadowWidth),
    },
    containerFloatLabel: {
      minHeight: theme.Button.Common.buttonHeightXL,
      maxHeight: theme.Button.Common.buttonHeightXL,
      height: theme.Button.Common.buttonHeightXL,
    },
    danger: { borderColor: theme.Form.InputText.inputErrorBorderColor },
    dangerFocused: { outlineColor: theme.General.focusOutlineErrorColor },
    disabled: {
      opacity: 0.6,
      borderColor: theme.Form.InputText.inputBorderColor,
      backgroundColor: theme.Button.Disabled.disabledButtonBg,
    },
    input: {
      flex: 1,
      paddingHorizontal: theme.Form.InputText.inputPaddingLeftRight,
      paddingVertical: 0,
      fontSize: typography.Size['text-base'],
      borderRadius: border.Radius['rounded-xl'],
      color: theme.Form.InputText.inputTextColor,
      overflow: 'hidden',
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontFamily: fonts.secondary,
    },
    inputFloatLabel: { paddingTop: 26, paddingBottom: 12 },
    placeholderTextColor: {
      color: theme.Form.InputText.inputPlaceholderTextColor,
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: theme.Form.InputText.inputPaddingLeftRight,
      gap: theme.Form.InputText.inputPaddingLeftRight,
      overflow: 'hidden',
    },
    rightIcon: { color: theme.Form.InputText.inputIconColor },
    iconSize: {
      width: typography.Size['text-base'],
      height: typography.Size['text-base'],
    },
    iconSizeFloatLabel: {
      width: typography.Size['text-xl'],
      height: typography.Size['text-xl'],
    },

    label: {
      position: 'absolute',
      left: 7,
      top: 19,
      paddingVertical: 0,
      paddingLeft: spacing.Padding['p-1'],
      paddingRight: spacing.Padding['p-2'],
      color: typography.Color.Common['text-color-secondary'],
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontSize: typography.Size['text-base'],
      fontFamily: fonts.secondary,
    },
    labelReducedSize: {
      fontSize: typography.Size['text-sm'],
      paddingVertical: spacing.Padding['p-1'],
      top: 7,
      fontFamily: fonts.primary,
    },
  })
)
