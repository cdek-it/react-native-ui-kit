import { makeStyles } from '../../../utils/makeStyles'

export const useDangerButtonStyles = () => {
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
    color: theme.Button.Severity.Danger.Basic.dangerButtonTextColor,
  },

  outlined: {
    color: theme.Button.Severity.Danger.Outlined.dangerOutlinedButtonTextColor,
  },

  text: {
    color: theme.Button.Severity.Danger.Text.dangerTextButtonTextColor,
  },
}))

const usePressedVarianttyles = makeStyles(({ theme }) => ({
  basic: {
    borderColor: theme.Button.Severity.Danger.Basic.dangerButtonBorderColor,
    backgroundColor: theme.Button.Basic.buttonHoverBg,
  },

  outlined: {
    borderColor: theme.Button.Severity.Danger.Outlined.dangerOutlinedButtonHoverBorderColor,
    backgroundColor: theme.Button.Severity.Danger.Outlined.dangerOutlinedButtonHoverBg,
  },

  text: {
    borderColor: theme.Surface['surface-transparent'],
    backgroundColor: theme.Button.Severity.Danger.Text.dangerTextButtonHoverBg,
    shadowColor: theme.General.focusOutlineColor,
    shadowOffset: { height: theme.General.focusShadowWidth, width: theme.General.focusShadowWidth },
    elevation: theme.General.focusShadowWidth,
    shadowOpacity: 1,
    shadowRadius: 3.5,
  },
}))

const useContainerVariantStyles = makeStyles(({ theme }) => ({
  basic: {
    borderColor: theme.Button.Severity.Danger.Basic.dangerButtonBorderColor,
    backgroundColor: theme.Button.Severity.Danger.Basic.dangerButtonBg,
  },

  outlined: {
    borderColor: theme.Button.Severity.Danger.Outlined.dangerOutlinedButtonBorderColor,
    backgroundColor: theme.Button.Severity.Danger.Outlined.dangerOutlinedButtonBg,
  },

  text: {
    borderColor: theme.Button.Severity.Danger.Basic.dangerButtonBorderColor,
    backgroundColor: theme.Button.Severity.Danger.Text.dangerTextButtonBg,
  },
}))

const useIconVariantStyles = makeStyles(({ theme }) => ({
  basic: {
    color: theme.Button.Severity.Danger.Basic.dangerButtonTextColor,
  },

  outlined: {
    color: theme.Button.Severity.Danger.Outlined.dangerOutlinedButtonTextColor,
  },

  text: {
    color: theme.Button.Severity.Danger.Text.dangerTextButtonTextColor,
  },
}))
