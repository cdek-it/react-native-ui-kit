import React, { memo } from 'react'
import { Text, type TextProps } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

export interface SubtitleProps extends TextProps {
  children: string
  /**
   * true, если необходим базовый размер текста подзаголовка
   * @default false
   */
  base?: boolean
  /**
   * Выбор цвета подзаголовка
   * @default 'default'
   */
  color?: 'default' | 'primary' | 'secondary'
}

/**
 * Используется для подзаголовков
 * @see https://www.figma.com/design/2ZnL6XPKEpxAHvrlbRvnMu/Template-Tailwind-CSS-(DS)?node-id=1-245
 */
export const Subtitle = memo<SubtitleProps>(({ base = false, color = 'default', ...other }) => {
  const styles = useStyles()

  return <Text style={[styles.text, styles[color], base && styles.base]} {...other} />
})

const useStyles = makeStyles(({ theme }) => ({
  text: {
    fontSize: 12.25,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  base: {
    fontSize: 14,
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
}))
