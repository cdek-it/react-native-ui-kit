import { makeStyles } from '../../../utils/makeStyles'

export const useSuccessButtonStyles = () => {
  const labelVariantStyles = useLabelVariantStyles()
  const pressedVariantStyles = usePressedVarianttyles()
  const containerVariantStyles = useContainerVariantStyles()
  const iconVariantStyles = useIconVariantStyles()

  return {
    containerVariantStyles,
    labelVariantStyles,
    pressedVariantStyles,
    iconVariantStyles,
  }
}

const useLabelVariantStyles = makeStyles(({ theme }) => ({
  basic: {
    color: theme.Button.Severity.Success.Basic.successButtonTextColor,
  },

  outlined: {
    color: theme.Button.Severity.Success.Outlined.successOutlinedButtonTextColor,
  },

  text: {
    color: theme.Button.Severity.Success.Text.successTextButtonTextColor,
  },
}))

const usePressedVarianttyles = makeStyles(({ theme }) => ({
  basic: {
    borderColor: theme.Button.Severity.Success.Basic.successButtonBorderColor,
    backgroundColor: theme.Button.Basic.buttonHoverBg,
  },

  outlined: {
    borderColor: theme.Button.Severity.Success.Outlined.successOutlinedButtonHoverBorderColor,
    backgroundColor: theme.Button.Severity.Success.Outlined.successOutlinedButtonHoverBg,
  },

  text: {
    borderColor: theme.Surface['surface-transparent'],
    backgroundColor: theme.Button.Severity.Success.Text.successTextButtonHoverBg,
    shadowColor: theme.General.focusOutlineColor,
    shadowOffset: { height: theme.General.focusShadowWidth, width: theme.General.focusShadowWidth },
    elevation: theme.General.focusShadowWidth,
    shadowOpacity: 1,
    shadowRadius: 3.5,
  },
}))

const useContainerVariantStyles = makeStyles(({ theme }) => ({
  basic: {
    borderColor: theme.Button.Severity.Success.Basic.successButtonBorderColor,
    backgroundColor: theme.Button.Severity.Success.Basic.successButtonBg,
  },

  outlined: {
    borderColor: theme.Button.Severity.Success.Outlined.successOutlinedButtonBorderColor,
    backgroundColor: theme.Button.Severity.Success.Outlined.successOutlinedButtonBg,
  },

  text: {
    borderColor: theme.Button.Severity.Success.Basic.successButtonBorderColor,
    backgroundColor: theme.Button.Severity.Success.Text.successTextButtonBg,
  },
}))

const useIconVariantStyles = makeStyles(({ theme }) => ({
  basic: {
    color: theme.Button.Severity.Success.Basic.successButtonTextColor,
  },

  outlined: {
    color: theme.Button.Severity.Success.Outlined.successOutlinedButtonTextColor,
  },

  text: {
    color: theme.Button.Severity.Success.Text.successTextButtonTextColor,
  },
}))
