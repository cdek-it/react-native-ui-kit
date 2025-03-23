import { memo } from 'react'

import type { BaseButtonProps, VariantStyles } from '../types'

import { useIconStyle } from './useIconStyle'

export const ButtonIcon = memo<
  Pick<Required<BaseButtonProps>, 'size' | 'variant' | 'disabled' | 'loading'> &
    Pick<BaseButtonProps, 'Icon'> &
    Pick<VariantStyles, 'iconVariantStyles'>
>(({ size, variant, disabled, loading, Icon, iconVariantStyles }) => {
  const iconStyle = useIconStyle(
    size,
    variant,
    disabled,
    loading,
    iconVariantStyles
  )

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
