import type { ButtonSeverityAppearance, ButtonSeverity } from '../types'

import {
  createButtonStyleResolver,
  type ButtonColorResolver,
} from './buttonStyles'
import type {
  ButtonStyleResolver,
  SeverityButtonAppearanceProps,
} from './types'

const getSeverityButtonColors: ButtonColorResolver<
  SeverityButtonAppearanceProps
> = (button, props) => {
  const { variant, severity, state } = props
  const key = severity === 'warning' ? 'warn' : severity
  const pressed = state === 'pressed'
  const root = button.colorScheme.root[key]
  const borderColor = pressed ? root.activeBorderColor : root.borderColor

  if (props.state === 'disabled' || props.state === 'loading') {
    return {
      backgroundColor: button.extend.disabledBackground,
      borderColor,
      color: button.extend.disabledColor,
    }
  }

  if (variant === 'outlined' || variant === 'text') {
    const tokens = button.colorScheme[variant][key]

    return {
      backgroundColor: pressed ? tokens.activeBackground : 'transparent',
      borderColor:
        variant === 'outlined'
          ? button.colorScheme.outlined[key].borderColor
          : borderColor,
      color: tokens.color,
    }
  }

  return {
    backgroundColor: pressed ? root.activeBackground : root.background,
    borderColor,
    color: pressed ? root.activeColor : root.color,
  }
}

const resolveStyles = createButtonStyleResolver(getSeverityButtonColors)

export const getSeverityButtonStyles =
  (
    appearance: ButtonSeverityAppearance,
    severity: ButtonSeverity
  ): ButtonStyleResolver =>
  (props) =>
    resolveStyles({ ...props, variant: appearance, severity })
