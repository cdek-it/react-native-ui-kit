import React, { memo } from 'react'

import type { BaseButtonProps } from '../types'

import { ButtonActivityIndicator } from './ButtonActivityIndicator'
import { ButtonIcon } from './ButtonIcon'

export const ButtonLeftArea = memo<
  Pick<BaseButtonProps, 'iconPosition' | 'Icon'> &
    Pick<Required<BaseButtonProps>, 'size' | 'variant' | 'loading' | 'disabled'>
>(({ size, iconPosition, variant, Icon, loading, disabled }) => {
  if (iconPosition === 'left' || !Icon) {
    if (loading && !disabled) {
      return <ButtonActivityIndicator />
    } else if (Icon) {
      return <ButtonIcon {...{ size, variant, disabled, loading, Icon }} />
    }
  }

  return null
})
