import { makeStyles } from '../../../utils/makeStyles'

export const useHelpButtonStyles = () => {
  const labelVariantStyles = useLabelVariantStyles()
  const pressedVariantStyles = usePressedVariantStyles()
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
  basic: { color: theme.Button.Severity.Help.Basic.helpButtonTextColor },

  outlined: {
    color: theme.Button.Severity.Help.Outlined.helpOutlinedButtonTextColor,
  },

  text: { color: theme.Button.Severity.Help.Text.helpTextButtonTextColor },
}))

const usePressedVariantStyles = makeStyles(({ theme }) => ({
  basic: {
    borderColor: theme.Button.Severity.Help.Basic.helpButtonBorderColor,
    backgroundColor: theme.Button.Severity.Help.Basic.helpButtonHoverBg,
  },

  outlined: {
    borderColor:
      theme.Button.Severity.Help.Outlined.helpOutlinedButtonHoverBorderColor,
    backgroundColor:
      theme.Button.Severity.Help.Outlined.helpOutlinedButtonHoverBg,
  },

  text: {
    borderColor: theme.Surface['surface-transparent'],
    backgroundColor: theme.Button.Severity.Help.Text.helpTextButtonHoverBg,
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
    borderColor: theme.Button.Severity.Help.Basic.helpButtonBorderColor,
    backgroundColor: theme.Button.Severity.Help.Basic.helpButtonBg,
  },

  outlined: {
    borderColor:
      theme.Button.Severity.Help.Outlined.helpOutlinedButtonBorderColor,
    backgroundColor: theme.Button.Severity.Help.Outlined.helpOutlinedButtonBg,
  },

  text: {
    borderColor: theme.Button.Severity.Help.Basic.helpButtonBorderColor,
    backgroundColor: theme.Button.Severity.Help.Text.helpTextButtonBg,
  },
}))

const useIconVariantStyles = makeStyles(({ theme }) => ({
  basic: { color: theme.Button.Severity.Help.Basic.helpButtonTextColor },

  outlined: {
    color: theme.Button.Severity.Help.Outlined.helpOutlinedButtonTextColor,
  },

  text: { color: theme.Button.Severity.Help.Text.helpTextButtonTextColor },
}))
