import { memo } from 'react'

import { BaseButton } from './internal/BaseButton'
import { adaptButtonSeverityProps } from './internal/deprecated/adaptButtonSeverityProps'
import { getSeverityButtonStyles } from './internal/getSeverityButtonStyles'
import type {
  ButtonProps,
  ButtonSeverityProps,
  ButtonSeverityVariant,
} from './types'

/**
 * Button component
 * @param size - button size
 * @param rounded - rounded corners
 * @param loading - button loading state
 * @param appearance - button presentation
 * @param disabled - button disabled state
 * @param iconOnly - button with only Icon
 * @param iconPosition - icon position
 * @param Icon - Tabler icon
 * @param label - button label
 * @param style - external style control for component
 * @param severity - severity button styling variant
 * @see BaseButton
 */
export const ButtonSeverity = memo<
  ButtonProps<ButtonSeverityVariant> & ButtonSeverityProps
>((props) => {
  const { appearance, severity, ...buttonProps } =
    adaptButtonSeverityProps(props)

  return (
    <BaseButton
      resolveStyles={getSeverityButtonStyles(appearance, severity)}
      {...buttonProps}
    />
  )
})
