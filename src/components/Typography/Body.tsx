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

// Цвета Typography берутся из семантических ролей: отдельных токенов компонента нет
const styles = StyleSheet.create(({ semantic, fonts }) => ({
  text: {
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.fontFamily.base,
  },
  regular: { fontWeight: fonts.fontWeight.regular },
  bold: {
    fontWeight: fonts.fontWeight.bold,
    letterSpacing: fonts.letterSpacing[400],
  },
  default: { color: semantic.colorScheme.color.fg.default },
  primary: { color: semantic.colorScheme.color.fg.brand.default },
  secondary: { color: semantic.colorScheme.color.fg.muted },
  base: { fontSize: fonts.fontSize[200], lineHeight: fonts.lineHeight[300] },
  lg: { fontSize: fonts.fontSize[300], lineHeight: fonts.lineHeight[400] },
  xl: {
    fontSize: fonts.fontSize[500],
    lineHeight: fonts.lineHeight[700],
    letterSpacing: fonts.letterSpacing[500],
  },
  paragraphLg: { lineHeight: fonts.lineHeight[500] },
  paragraphBase: { lineHeight: 21 },
  strikethrough: { textDecorationLine: 'line-through' },
  disabled: { opacity: semantic.effects.opacity[60] },
}))
