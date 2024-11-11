import React, { memo } from 'react'
import { Text } from 'react-native'

import type { BaseButtonProps, VariantStyles } from '../types'

import { useButtonLabelStyle } from './useButtonLabelStyle'

export const ButtonLabel = memo<
  Pick<BaseButtonProps, 'iconOnly' | 'label'> &
    Pick<Required<BaseButtonProps>, 'size' | 'variant' | 'disabled' | 'loading'> &
    Pick<VariantStyles, 'labelVariantStyles'>
>(({ label, iconOnly, size, disabled, loading, variant, labelVariantStyles }) => {
  const labelStyle = useButtonLabelStyle(size, variant, disabled, loading, labelVariantStyles)

  if (iconOnly) {
    return null
  }

  return (
    <Text style={labelStyle} testID='Button_Text'>
      {label}
    </Text>
  )
})
