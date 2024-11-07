import { useMemo } from 'react'
import { type ColorValue, StyleSheet } from 'react-native'

import { makeStyles } from '../../../utils/makeStyles'
import type { BaseButtonProps } from '../types'

import { useTypeBasedStyle } from './useTypeBasedStyle'

export const useIconStyle = (
  size: Required<BaseButtonProps>['size'],
  variant: Required<BaseButtonProps>['variant'],
  disabled: Required<BaseButtonProps>['disabled'],
  loading: Required<BaseButtonProps>['loading']
) => {
  const styles = useStyles()

  const sizeBasedStyle = useTypeBasedStyle(size, styles)
  const variantBasedStyle = useTypeBasedStyle(variant, styles)

  return useMemo(() => {
    const containerStyle = [sizeBasedStyle, variantBasedStyle]

    if (disabled || loading) {
      containerStyle.push(styles.disabled)
    }

    return StyleSheet.flatten(containerStyle) as {
      width: number
      height: number
      color: ColorValue
    }
  }, [disabled, loading, sizeBasedStyle, styles.disabled, variantBasedStyle])
}

const useStyles = makeStyles(({ theme }) => ({
  xLarge: {
    height: 28,
    width: 28,
  },

  large: {
    height: 21,
    width: 21,
  },

  base: {
    height: 17.5,
    width: 17.5,
  },

  small: {
    height: 14,
    width: 14,
  },

  basic: {
    color: theme.Button.Basic.buttonTextColor,
  },

  outlined: {
    color: theme.Button.Outlined.outlinedButtonTextColor,
  },

  text: {
    color: theme.Button.Text.textButtonTextColor,
  },

  disabled: {
    color: theme.Button.Disabled.disabledButtonTextColor,
  },
}))
