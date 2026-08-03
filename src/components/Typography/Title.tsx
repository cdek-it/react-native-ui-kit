import { Text, type TextProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

export interface TitleProps extends TextProps {
  readonly level: 'd1' | 'd2' | 'd3' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const Title = ({ level, style, ...other }: TitleProps) => (
  <Text style={[styles.text, styles[level], style]} testID='Title' {...other} />
)

// Осознанный обход слоя components: цвет текста — семантическая роль, и своего
// токена у Typography нет (компонент отсутствует в tokens.json).
const styles = StyleSheet.create(({ primitive, semantic, fonts }) => ({
  text: {
    color: semantic.colorScheme.color.fg.default,
    fontFamily: fonts.primary,
    fontWeight: 700,
    includeFontPadding: false,
    verticalAlign: 'middle',
  },
  d1: { fontSize: primitive.fonts.fontSize[750] },
  d2: { fontSize: primitive.fonts.fontSize[700] },
  d3: { fontSize: primitive.fonts.fontSize[650] },
  h1: { fontSize: primitive.fonts.fontSize[600] },
  h2: { fontSize: primitive.fonts.fontSize[500] },
  h3: { fontSize: primitive.fonts.fontSize[400] },
  h4: { fontSize: primitive.fonts.fontSize[300] },
  h5: { fontSize: primitive.fonts.fontSize[100] },
  h6: { fontSize: primitive.fonts.fontSize[100] },
}))
