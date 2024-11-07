import { useMemo } from 'react'
import { type StyleProp, StyleSheet, type TextStyle } from 'react-native'

import { makeStyles } from '../../../utils/makeStyles'
import type { BaseButtonProps, LabelVariantStyles } from '../types'

import { useTypeBasedStyle } from './useTypeBasedStyle'

export const useButtonLabelStyle = (
  size: Required<BaseButtonProps>['size'],
  variant: Required<BaseButtonProps>['variant'],
  disabled: Required<BaseButtonProps>['disabled'],
  loading: Required<BaseButtonProps>['loading'],
  labelVariantStyles: LabelVariantStyles
) => {
  const styles = useButtonLabelStyles()

  const sizeBasedStyle = useTypeBasedStyle(size, styles)
  const variantBasedStyle = useTypeBasedStyle(variant, labelVariantStyles)

  return useMemo(() => {
    const containerStyle: Array<StyleProp<TextStyle>> = [
      styles.font,
      sizeBasedStyle,
      variantBasedStyle,
    ]

    if (disabled || loading) {
      containerStyle.push(styles.disabled)
    }

    return StyleSheet.flatten(containerStyle)
  }, [disabled, loading, sizeBasedStyle, styles.disabled, styles.font, variantBasedStyle])
}

const useButtonLabelStyles = makeStyles(({ theme }) => ({
  font: {
    fontWeight: 700,
  },

  xlarge: {
    fontSize: 21,
    lineHeight: 25,
  },

  large: {
    fontSize: 17.5,
    lineHeight: 21,
  },

  base: {
    fontSize: 14,
    lineHeight: 16,
  },

  small: {
    fontSize: 12.25,
    lineHeight: 14,
  },

  disabled: {
    color: theme.Button.Disabled.disabledButtonTextColor,
  },
}))
