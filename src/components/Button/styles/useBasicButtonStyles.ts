import { makeStyles } from '../../../utils/makeStyles'

export const useBasicButtonStyles = () => {
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
  basic: { color: theme.Button.Basic.buttonTextColor },

  outlined: { color: theme.Button.Outlined.outlinedButtonTextColor },

  text: { color: theme.Button.Text.textButtonTextColor },
}))

const usePressedVarianttyles = makeStyles(({ theme }) => ({
  basic: {
    borderColor: theme.Button.Basic.buttonBorderColor,
    backgroundColor: theme.Button.Basic.buttonHoverBg,
  },

  outlined: {
    borderColor: theme.Button.Outlined.outlinedButtonHoverBorderColor,
    backgroundColor: theme.Button.Outlined.outlinedButtonHoverBg,
  },

  text: {
    borderColor: theme.Button.Common.buttonHoverShadowColor,
    backgroundColor: theme.Button.Text.textButtonHoverBg,
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
    borderColor: theme.Button.Basic.buttonBorderColor,
    backgroundColor: theme.Button.Basic.buttonBg,
  },

  outlined: {
    borderColor: theme.Button.Outlined.outlinedButtonBorderColor,
    backgroundColor: theme.Button.Outlined.outlinedButtonBg,
  },

  text: {
    borderColor: theme.Button.Basic.buttonBorderColor,
    backgroundColor: theme.Button.Text.textButtonBg,
  },
}))

const useIconVariantStyles = makeStyles(({ theme }) => ({
  basic: { color: theme.Button.Basic.buttonTextColor },

  outlined: { color: theme.Button.Outlined.outlinedButtonTextColor },

  text: { color: theme.Button.Text.textButtonTextColor },
}))
