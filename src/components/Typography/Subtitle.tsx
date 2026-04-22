import { memo } from 'react'
import { Text, type TextProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

export interface SubtitleProps extends TextProps {
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
export const Subtitle = memo<SubtitleProps>(
  ({ base = false, color = 'default', style, ...other }) => (
    <Text
      style={[styles.text, styles[color], base && styles.base, style]}
      testID='Subtitle'
      {...other}
    />
  )
)

const styles = StyleSheet.create(({ theme, typography, fonts }) => ({
  text: {
    fontSize: typography.Size['text-sm'],
    fontWeight: 700,
    textTransform: 'uppercase',
    fontFamily: fonts.primary,
  },
  base: { fontSize: typography.Size['text-base'], fontFamily: fonts.secondary },
  default: { color: theme.General.textColor },
  primary: { color: theme.General.primaryColor },
  secondary: { color: theme.General.textSecondaryColor },
}))
