import { Text, type TextProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

export interface BodyProps extends TextProps {
  readonly base?: boolean
  readonly color?: 'default' | 'secondary' | 'primary'
  readonly disabled?: boolean
  readonly paragraph?: boolean
  readonly weight?: 'regular' | 'bold'
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
      testID='Body'
      {...other}
    />
  )
}

// Осознанный обход слоя components: цвет текста — семантическая роль, и своего
// токена у Typography нет (компонент отсутствует в tokens.json).
const styles = StyleSheet.create(({ primitive, semantic, fonts }) => ({
  text: {
    fontSize: primitive.fonts.fontSize[300],
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.secondary,
    lineHeight: primitive.fonts.lineHeight[450],
  },
  regular: { fontWeight: primitive.fonts.fontWeight.regular },
  bold: {
    fontWeight: primitive.fonts.fontWeight.bold,
    letterSpacing: primitive.fonts.letterSpacing[400],
  },
  default: { color: semantic.colorScheme.color.fg.default },
  primary: { color: semantic.colorScheme.color.fg.brand.default },
  secondary: { color: semantic.colorScheme.color.fg.muted },
  base: {
    fontSize: primitive.fonts.fontSize[200],
    lineHeight: primitive.fonts.lineHeight[400],
  },
  paragraph: { lineHeight: primitive.fonts.lineHeight[600] },
  paragraphBase: { lineHeight: primitive.fonts.lineHeight[500] },
  disabled: { opacity: 0.6 },
}))
