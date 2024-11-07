import React, { memo } from 'react'

import type { BaseButtonProps, VariantStyles } from '../types'

import { ButtonActivityIndicator } from './ButtonActivityIndicator'
import { ButtonIcon } from './ButtonIcon'

export const ButtonLeftArea = memo<
  Pick<BaseButtonProps, 'iconPosition' | 'Icon'> &
    Pick<Required<BaseButtonProps>, 'size' | 'variant' | 'loading' | 'disabled'> &
    Pick<VariantStyles, 'iconVariantStyles'>
>(({ size, iconPosition, variant, Icon, loading, disabled, iconVariantStyles }) => {
  if (iconPosition === 'left' || !Icon) {
    if (loading && !disabled) {
      return <ButtonActivityIndicator />
    } else {
      return <ButtonIcon {...{ size, variant, disabled, loading, Icon, iconVariantStyles }} />
    }
  }

  return null
})
