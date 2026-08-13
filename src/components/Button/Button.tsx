import { memo, useMemo } from 'react'

import { BaseButton } from './BaseButton'
import type { ButtonBaseVariant, ButtonProps } from './types'
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
 * @see BaseButton
 * @link https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=160-5223
 */
export const Button = memo<ButtonProps<ButtonBaseVariant>>(
  ({ variant = 'primary', ...props }) => {
    const variantContextValue = useMemo(() => ({ variant }), [variant])

    return (
      <ButtonVariantContext.Provider value={variantContextValue}>
        <BaseButton variant={variant} {...props} />
      </ButtonVariantContext.Provider>
    )
  }
)
