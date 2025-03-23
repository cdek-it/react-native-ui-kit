import { memo } from 'react'

import type { ButtonProps, VariantStyles } from './types'
import {
  ButtonLeftArea,
  ButtonRightArea,
  ButtonLabel,
  ButtonContainer,
} from './utils'

export const BaseButton = memo<ButtonProps & VariantStyles>(
  ({
    size = 'base',
    shape = 'square',
    loading = false,
    variant = 'basic',
    disabled = false,
    iconOnly,
    iconPosition = 'left',
    Icon,
    label,
    style,
    containerVariantStyles,
    labelVariantStyles,
    pressedVariantStyles,
    iconVariantStyles,
    ...props
  }) => {
    return (
      <ButtonContainer
        {...{
          size,
          variant,
          shape,
          disabled,
          loading,
          iconOnly,
          style,
          containerVariantStyles,
          pressedVariantStyles,
        }}
        {...props}
      >
        <ButtonLeftArea
          {...{
            size,
            variant,
            loading,
            disabled,
            Icon,
            iconPosition,
            iconVariantStyles,
          }}
        />
        <ButtonLabel
          {...{
            size,
            variant,
            loading,
            disabled,
            iconOnly,
            label,
            labelVariantStyles,
          }}
        />
        <ButtonRightArea
          {...{
            size,
            variant,
            loading,
            disabled,
            Icon,
            iconPosition,
            iconVariantStyles,
          }}
        />
      </ButtonContainer>
    )
  }
)
