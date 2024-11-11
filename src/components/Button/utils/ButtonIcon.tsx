import React, { memo } from 'react'

import type { BaseButtonProps } from '../types'

import { useIconStyle } from './useIconStyle'

export const ButtonIcon = memo<
  Pick<Required<BaseButtonProps>, 'size' | 'variant' | 'disabled' | 'loading'> &
    Pick<BaseButtonProps, 'Icon'>
>(({ size, variant, disabled, loading, Icon }) => {
  const iconStyle = useIconStyle(size, variant, disabled, loading)

  if (!Icon) {
    return null
  }

  return (
    <Icon
      height={iconStyle.height}
      style={iconStyle}
      testID='Button_Icon'
      width={iconStyle.width}
    />
  )
})
