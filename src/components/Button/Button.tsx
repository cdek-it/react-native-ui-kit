import { memo } from 'react'

import { BaseButton } from './internal/BaseButton'
import { adaptButtonProps } from './internal/deprecated/adaptButtonProps'
import { getButtonStyles } from './internal/getButtonStyles'
import type { ButtonBaseVariant, ButtonProps } from './types'

/**
 * Button component
 * @param size - button size
 * @param rounded - rounded corners
 * @param loading - button loading state
 * @param variant - button variant
 * @param disabled - button disabled state
 * @param iconOnly - button with only Icon
 * @param iconPosition - icon position
 * @param Icon - Tabler icon
 * @param label - button label
 * @param style - external style control for component
 * @see BaseButton
 * @link https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=160-5223
 */
export const Button = memo<ButtonProps<ButtonBaseVariant>>(
  ({ variant = 'primary', ...props }) => (
    <BaseButton
      resolveStyles={getButtonStyles(variant)}
      {...adaptButtonProps(props)}
    />
  )
)
