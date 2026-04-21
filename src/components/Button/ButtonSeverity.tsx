import { memo, useMemo } from 'react'

import { BaseButton } from './BaseButton'
import type {
  ButtonProps,
  ButtonSeverityProps,
  ButtonSeverityVariant,
} from './types'
import { ButtonVariantContext } from './utils/ButtonVariantContext'

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
export const ButtonSeverity = memo<
  ButtonProps<ButtonSeverityVariant> & ButtonSeverityProps
>(({ severity, variant = 'basic', ...props }) => {
  const variantContextValue = useMemo(
    () => ({ variant, severity }),
    [severity, variant]
  )

  return (
    <ButtonVariantContext.Provider value={variantContextValue}>
      <BaseButton variant={variant} {...props} />
    </ButtonVariantContext.Provider>
  )
})
