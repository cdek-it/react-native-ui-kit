import React, { memo } from 'react'

import type { BaseButtonProps } from '../types'

import { ButtonActivityIndicator } from './ButtonActivityIndicator'
import { ButtonIcon } from './ButtonIcon'

export const ButtonRightArea = memo<
  Pick<BaseButtonProps, 'iconPosition' | 'Icon'> &
    Pick<Required<BaseButtonProps>, 'size' | 'variant' | 'loading' | 'disabled'>
>(({ size, iconPosition, variant, Icon, loading, disabled }) => {
  if (iconPosition === 'right' && Icon) {
    if (loading && !disabled) {
      return <ButtonActivityIndicator />
    } else {
      return <ButtonIcon {...{ size, variant, disabled, loading, Icon }} />
    }
  }

  return null
})
