import React, { memo, type ReactNode } from 'react'
import { Pressable } from 'react-native'

import type { BaseButtonProps, VariantStyles } from '../types'

import { useButtonContainerCallbackStyle } from './useButtonContainerCallbackStyle'

export const ButtonContainer = memo<
  Omit<
    BaseButtonProps,
    'size' | 'variant' | 'disabled' | 'loading' | 'shape' | 'Icon' | 'iconPosition' | 'label'
  > &
    Pick<Required<BaseButtonProps>, 'size' | 'variant' | 'disabled' | 'loading' | 'shape'> & {
      children: ReactNode
    } & Pick<VariantStyles, 'containerVariantStyles' | 'pressedVariantStyles'>
>(
  ({
    style,
    size,
    disabled,
    loading,
    variant,
    shape,
    iconOnly,
    children,
    containerVariantStyles,
    pressedVariantStyles,
    ...props
  }) => {
    const containerCallbackStyle = useButtonContainerCallbackStyle(
      size,
      variant,
      shape,
      disabled,
      loading,
      iconOnly,
      style,
      containerVariantStyles,
      pressedVariantStyles
    )

    return (
      <Pressable disabled={disabled || loading} style={containerCallbackStyle} {...props}>
        {children}
      </Pressable>
    )
  }
)
