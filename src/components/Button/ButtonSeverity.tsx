import { memo } from 'react'

import { BaseButton } from './BaseButton'
import { useSeverityButtonStyles } from './styles'
import type { ButtonProps, ButtonSeverityProps } from './types'

/**
 * Button component
 * @param size - button size
 * @param shape - button shape
 * @param loading - button loading state
 * @param variant - button variant
 * @param disabled - button disabled state
 * @param iconOnly - button with only Icon
 * @param iconPosition - icon position
 * @param Icon - Tabler icon
 * @param label - button label
 * @param style - external style control for component
 * @param severity - severity button styling variant
 * @see BaseButton
 */
export const ButtonSeverity = memo<ButtonProps & ButtonSeverityProps>(
  ({ severity, ...props }) => {
    const buttonStyles = useSeverityButtonStyles(severity)

    return <BaseButton {...props} {...buttonStyles} />
  }
)
