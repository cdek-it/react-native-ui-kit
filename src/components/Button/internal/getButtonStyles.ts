import type { ButtonBaseVariant } from '../types'

import {
  createButtonStyleResolver,
  type ButtonColorResolver,
} from './buttonStyles'
import type { ButtonStyleResolver, ButtonAppearanceProps } from './types'

const getButtonColors: ButtonColorResolver<ButtonAppearanceProps> = (
  button,
  props
) => {
  if (props.state === 'disabled' || props.state === 'loading') {
    return {
      backgroundColor:
        props.variant === 'link'
          ? 'transparent'
          : button.extend.disabledBackground,
      borderColor: 'transparent',
      color: button.extend.disabledColor,
    }
  }

  const { variant, state } = props
  const pressed = state === 'pressed'

  if (variant === 'link') {
    return {
      backgroundColor: button.extend.extLink.background,
      borderColor: 'transparent',
      color: pressed
        ? button.colorScheme.link.activeColor
        : button.colorScheme.link.color,
    }
  }

  if (variant === 'text') {
    const tokens = button.colorScheme.text.primary

    return {
      backgroundColor: pressed ? tokens.activeBackground : 'transparent',
      borderColor: 'transparent',
      color: tokens.color,
    }
  }

  const key = variant === 'tertiary' ? 'contrast' : variant
  const tokens = button.colorScheme.root[key]

  return {
    backgroundColor: pressed ? tokens.activeBackground : tokens.background,
    borderColor: pressed ? tokens.activeBorderColor : tokens.borderColor,
    color: pressed ? tokens.activeColor : tokens.color,
  }
}

const resolveStyles = createButtonStyleResolver(getButtonColors)

export const getButtonStyles =
  (variant: ButtonBaseVariant): ButtonStyleResolver =>
  (props) =>
    resolveStyles({ ...props, variant })
