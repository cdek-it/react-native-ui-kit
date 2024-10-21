import React from 'react'
import { Text, type TextProps } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

export interface BodyProps extends TextProps {
  base?: boolean
  color?: 'default' | 'secondary' | 'primary'
  disabled?: boolean
  paragraph?: boolean
  weight?: 'regular' | 'medium' | 'bold'
}

export const Body = ({
  base,
  color = 'default',
  disabled,
  paragraph,
  weight = 'regular',
  style,
  ...other
}: BodyProps) => {
  const styles = useStyles()

  return (
    <Text
      style={[
        styles.text,
        styles[weight],
        styles[color],
        base && styles.base,
        paragraph && (base ? styles.paragraphBase : styles.paragraph),
        disabled && styles.disabled,
        style,
      ]}
      {...other}
    />
  )
}

const useStyles = makeStyles(({ theme }) => ({
  text: {
    fontSize: 15.75,
  },
  regular: {
    fontFamily: 'Roboto',
    fontWeight: 400,
  },
  medium: {
    fontWeight: 500,
  },
  bold: {
    fontWeight: 700,
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
  base: {
    fontSize: 14,
  },
  paragraph: {
    lineHeight: 23.63,
  },
  paragraphBase: {
    lineHeight: 21,
  },
  disabled: {
    opacity: 0.6,
  },
}))
