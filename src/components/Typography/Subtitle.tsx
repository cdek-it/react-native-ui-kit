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

// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-sm; value=12.25
// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-xs; value=10.5
// Осознанный обход слоя components: цвет текста — семантическая роль, и своего
// токена у Typography нет (компонент отсутствует в tokens.json).
const styles = StyleSheet.create(({ semantic, typography, fonts }) => ({
  text: {
    fontSize: typography.Size['text-xs'],
    fontWeight: 700,
    textTransform: 'uppercase',
    fontFamily: fonts.secondary,
    lineHeight: 15,
  },
  base: { lineHeight: 18, fontSize: typography.Size['text-sm'] },
  default: { color: semantic.colorScheme.color.fg.default },
  primary: { color: semantic.colorScheme.color.fg.brand.default },
  secondary: { color: semantic.colorScheme.color.fg.muted },
}))
