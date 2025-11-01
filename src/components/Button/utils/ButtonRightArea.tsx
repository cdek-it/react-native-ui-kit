import { memo } from 'react'

import type { BaseButtonProps, VariantStyles } from '../types'

import { ButtonActivityIndicator } from './ButtonActivityIndicator'
import { ButtonIcon } from './ButtonIcon'

export const ButtonRightArea = memo<
  Pick<BaseButtonProps, 'iconPosition' | 'Icon'> &
    Pick<
      Required<BaseButtonProps>,
      'size' | 'variant' | 'loading' | 'disabled'
    > &
    Pick<VariantStyles, 'iconVariantStyles'>
>(
  ({
    size,
    iconPosition,
    variant,
    Icon,
    loading,
    disabled,
    iconVariantStyles,
  }) => {
    if (iconPosition === 'right' && Icon) {
      if (loading && !disabled) {
        return <ButtonActivityIndicator />
      }

      return (
        <ButtonIcon
          {...{ size, variant, disabled, loading, Icon, iconVariantStyles }}
        />
      )
    }

    return null
  }
)
