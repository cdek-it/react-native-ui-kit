import React, { memo } from 'react'
import { Text } from 'react-native'

import type { BaseButtonProps } from '../types'

import { useButtonLabelStyle } from './useButtonLabelStyle'

export const ButtonLabel = memo<
  Pick<BaseButtonProps, 'iconOnly' | 'label'> &
    Pick<Required<BaseButtonProps>, 'size' | 'variant' | 'disabled' | 'loading'>
>(({ label, iconOnly, size, disabled, loading, variant }) => {
  const labelStyle = useButtonLabelStyle(size, variant, disabled, loading)

  if (iconOnly) {
    return null
  }

  return (
    <Text style={labelStyle} testID='Button_Text'>
      {label}
    </Text>
  )
})
