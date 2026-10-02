import { memo, useMemo } from 'react'

import { BaseButton } from './internal/BaseButton'
import { ButtonVariantContext } from './internal/contexts/ButtonVariantContext'
import { resolveButtonSeverityVariant } from './internal/resolveButtonProps'
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
>(
  ({
    severity,
    appearance,
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- Preserve the alias until 2.0.
    variant: deprecatedVariant,
    ...props
  }) => {
    const variant = resolveButtonSeverityVariant(appearance, deprecatedVariant)
    const variantContextValue = useMemo(
      () => ({ variant, severity }),
      [severity, variant]
    )

    return (
      <ButtonVariantContext.Provider value={variantContextValue}>
        <BaseButton variant={variant} {...props} />
      </ButtonVariantContext.Provider>
    )
  }
)
