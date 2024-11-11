import { makeStyles } from '../../../utils/makeStyles'
import type { BaseButtonProps } from '../types'

import { useTypeBasedStyle } from './useTypeBasedStyle'

export const useButtonPressedStyle = (variant: Required<BaseButtonProps>['variant']) => {
  const styles = useButtonContainerStyle()

  return useTypeBasedStyle(variant, styles)
}

const useButtonContainerStyle = makeStyles(({ theme, border }) => ({
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
    shadowOffset: { height: theme.General.focusShadowWidth, width: theme.General.focusShadowWidth },
    elevation: theme.General.focusShadowWidth,
    shadowOpacity: 1,
    shadowRadius: 3.5,
  },
}))
