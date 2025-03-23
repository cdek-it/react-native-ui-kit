import { memo } from 'react'

import { BaseButton } from './BaseButton'
import { useBasicButtonStyles } from './styles'
import type { ButtonProps } from './types'

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
 */
export const Button = memo<ButtonProps>((props) => {
  const buttonStyles = useBasicButtonStyles()

  return <BaseButton {...props} {...buttonStyles} />
})
