import React, { memo, type ReactNode } from 'react'
import { Pressable } from 'react-native'

import type { BaseButtonProps } from '../types'

import { useButtonContainerCallbackStyle } from './useButtonContainerCallbackStyle'

export const ButtonContainer = memo<
  Omit<
    BaseButtonProps,
    'size' | 'variant' | 'disabled' | 'loading' | 'shape' | 'Icon' | 'iconPosition' | 'label'
  > &
    Pick<Required<BaseButtonProps>, 'size' | 'variant' | 'disabled' | 'loading' | 'shape'> & {
      children: ReactNode
    }
>(({ style, size, disabled, loading, variant, shape, iconOnly, children, ...props }) => {
  const containerCallbackStyle = useButtonContainerCallbackStyle(
    size,
    variant,
    shape,
    disabled,
    loading,
    iconOnly,
    style
  )

  return (
    <Pressable disabled={disabled || loading} style={containerCallbackStyle} {...props}>
      {children}
    </Pressable>
  )
})
