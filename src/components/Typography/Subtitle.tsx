import { memo } from 'react'
import { Text, type TextProps } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

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
  ({ base = false, color = 'default', style, ...other }) => {
    const styles = useStyles()

    return (
      <Text
        style={[styles.text, styles[color], base && styles.base, style]}
        testID='Subtitle'
        {...other}
      />
    )
  }
)

const useStyles = makeStyles(({ theme, typography, fonts }) => ({
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
