import React from 'react'
import { Text, type TextProps } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

export interface CaptionProps extends TextProps {
  color?: 'default' | 'secondary' | 'primary'
  disabled?: boolean
}

export const Caption = ({ color = 'default', disabled, style, ...other }: CaptionProps) => {
  const styles = useStyles()

  return (
    <Text style={[styles.text, styles[color], disabled && styles.disabled, style]} {...other} />
  )
}

const useStyles = makeStyles(({ theme }) => ({
  text: {
    fontSize: 12.25,
    includeFontPadding: false,
    verticalAlign: 'middle',
  },
  default: {
    color: theme.General.textColor,
  },
  primary: {
    color: theme.General.primaryColor,
  },
  secondary: {
    color: theme.General.textSecondaryColor,
  },
  disabled: {
    opacity: 0.6,
  },
}))
