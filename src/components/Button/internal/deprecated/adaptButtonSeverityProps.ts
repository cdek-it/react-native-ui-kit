import type {
  ButtonSeverityAppearance,
  ButtonSeverityVariant,
  ButtonShape,
} from '../../types'

import { adaptButtonProps } from './adaptButtonProps'

export const adaptButtonSeverityProps = <
  Props extends {
    appearance?: ButtonSeverityAppearance
    variant?: ButtonSeverityVariant
    rounded?: boolean
    shape?: ButtonShape
  },
>({
  appearance,
  variant,
  ...props
}: Props) => ({
  ...adaptButtonProps(props),
  appearance:
    appearance ?? (variant === 'basic' ? 'filled' : variant) ?? 'filled',
})
