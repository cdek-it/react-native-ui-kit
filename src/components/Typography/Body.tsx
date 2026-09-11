import { Text, type TextProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

export interface BodyProps extends TextProps {
  /**
   * @deprecated Используйте `size`. Проп будет удалён в следующей мажорной версии.
   */
  readonly base?: boolean
  readonly size?: 'base' | 'lg' | 'xl'
  readonly color?: 'default' | 'secondary' | 'primary'
  readonly disabled?: boolean
  readonly paragraph?: boolean
  readonly strikethrough?: boolean
  readonly weight?: 'regular' | 'bold'
}

export const Body = ({
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- fallback поддерживается до следующей мажорной версии
  base,
  size,
  color = 'default',
  disabled,
  paragraph,
  strikethrough,
  weight = 'regular',
  style,
  ...other
}: BodyProps) => {
  // TODO: удалить fallback на base при следующем мажорном обновлении.
  const resolvedSize = size ?? (base ? 'base' : 'lg')

  return (
    <Text
      style={[
        styles.text,
        styles[weight],
        styles[color],
        styles[resolvedSize],
        paragraph &&
          (resolvedSize === 'base'
            ? styles.paragraphBase
            : resolvedSize === 'lg'
              ? styles.paragraphLg
              : undefined),
        strikethrough && styles.strikethrough,
        disabled && styles.disabled,
        style,
      ]}
      testID='Body'
      {...other}
    />
  )
}

const styles = StyleSheet.create(({ theme, typography, fonts }) => ({
  text: {
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.secondary,
  },
  regular: { fontWeight: 400 },
  bold: { fontWeight: 700, letterSpacing: -0.5 },
  default: { color: theme.General.textColor },
  primary: { color: theme.General.primaryColor },
  secondary: { color: theme.General.textSecondaryColor },
  base: { fontSize: typography.Size['text-sm'], lineHeight: 18 },
  lg: { fontSize: typography.Size['text-base'], lineHeight: 20 },
  xl: {
    fontSize: typography.Size['text-xl'],
    lineHeight: 30,
    letterSpacing: 0,
  },
  paragraphLg: { lineHeight: 24 },
  paragraphBase: { lineHeight: 21 },
  strikethrough: { textDecorationLine: 'line-through' },
  disabled: { opacity: 0.6 },
}))
