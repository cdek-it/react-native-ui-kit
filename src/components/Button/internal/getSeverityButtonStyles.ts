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
  if (props.state === 'disabled' || props.state === 'loading') {
    return {
      backgroundColor: button.extend.disabledBackground,
      borderColor: 'transparent',
      color: button.extend.disabledColor,
    }
  }

  const { variant, severity, state } = props
  const key = severity === 'warning' ? 'warn' : severity
  const pressed = state === 'pressed'

  if (variant === 'outlined' || variant === 'text') {
    const tokens = button.colorScheme[variant][key]

    return {
      backgroundColor: pressed ? tokens.activeBackground : 'transparent',
      borderColor:
        variant === 'outlined'
          ? button.colorScheme.outlined[key].borderColor
          : 'transparent',
      color: tokens.color,
    }
  }

  const tokens = button.colorScheme.root[key]

  return {
    backgroundColor: pressed ? tokens.activeBackground : tokens.background,
    borderColor: pressed ? tokens.activeBorderColor : tokens.borderColor,
    color: pressed ? tokens.activeColor : tokens.color,
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
