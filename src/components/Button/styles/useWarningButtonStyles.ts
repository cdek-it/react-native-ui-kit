import { makeStyles } from '../../../utils/makeStyles'

export const useWarningButtonStyles = () => {
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
  basic: { color: theme.Button.Severity.Warning.Basic.warningButtonTextColor },

  outlined: {
    color:
      theme.Button.Severity.Warning.Outlined.warningOutlinedButtonTextColor,
  },

  text: {
    color: theme.Button.Severity.Warning.Text.warningTextButtonTextColor,
  },
}))

const usePressedVarianttyles = makeStyles(({ theme }) => ({
  basic: {
    borderColor: theme.Button.Severity.Warning.Basic.warningButtonBorderColor,
    backgroundColor: theme.Button.Basic.buttonHoverBg,
  },

  outlined: {
    borderColor:
      theme.Button.Severity.Warning.Outlined
        .warningOutlinedButtonHoverBorderColor,
    backgroundColor:
      theme.Button.Severity.Warning.Outlined.warningOutlinedButtonHoverBg,
  },

  text: {
    borderColor: theme.Surface['surface-transparent'],
    backgroundColor:
      theme.Button.Severity.Warning.Text.warningTextButtonHoverBg,
    shadowColor: theme.General.focusOutlineColor,
    shadowOffset: {
      height: theme.General.focusShadowWidth,
      width: theme.General.focusShadowWidth,
    },
    elevation: theme.General.focusShadowWidth,
    shadowOpacity: 1,
    shadowRadius: 3.5,
  },
}))

const useContainerVariantStyles = makeStyles(({ theme }) => ({
  basic: {
    borderColor: theme.Button.Severity.Warning.Basic.warningButtonBorderColor,
    backgroundColor: theme.Button.Severity.Warning.Basic.warningButtonBg,
  },

  outlined: {
    borderColor:
      theme.Button.Severity.Warning.Outlined.warningOutlinedButtonBorderColor,
    backgroundColor:
      theme.Button.Severity.Warning.Outlined.warningOutlinedButtonBg,
  },

  text: {
    borderColor: theme.Button.Severity.Warning.Basic.warningButtonBorderColor,
    backgroundColor: theme.Button.Severity.Warning.Text.warningTextButtonBg,
  },
}))

const useIconVariantStyles = makeStyles(({ theme }) => ({
  basic: { color: theme.Button.Severity.Warning.Basic.warningButtonTextColor },

  outlined: {
    color:
      theme.Button.Severity.Warning.Outlined.warningOutlinedButtonTextColor,
  },

  text: {
    color: theme.Button.Severity.Warning.Text.warningTextButtonTextColor,
  },
}))
