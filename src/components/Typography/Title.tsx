import { Text, type TextProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

export interface TitleProps extends TextProps {
  readonly level: 'd1' | 'd2' | 'd3' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const Title = ({ level, style, ...other }: TitleProps) => (
  <Text style={[styles.text, styles[level], style]} testID='Title' {...other} />
)

// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-2xl; value=21
// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-3xl; value=26.25
// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-4xl; value=31.5
// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-5xl; value=42
// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-base; value=14
// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-lg; value=15.75
// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-sm; value=12.25
// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-xl; value=17.5
// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-xs; value=10.5
// Осознанный обход слоя components: цвет текста — семантическая роль, и своего
// токена у Typography нет (компонент отсутствует в tokens.json).
const styles = StyleSheet.create(({ semantic, typography, fonts }) => ({
  text: {
    color: semantic.colorScheme.color.fg.default,
    fontFamily: fonts.primary,
    fontWeight: 700,
    includeFontPadding: false,
    verticalAlign: 'middle',
  },
  d1: { fontSize: typography.Size['text-5xl'] },
  d2: { fontSize: typography.Size['text-4xl'] },
  d3: { fontSize: typography.Size['text-3xl'] },
  h1: { fontSize: typography.Size['text-2xl'] },
  h2: { fontSize: typography.Size['text-xl'] },
  h3: { fontSize: typography.Size['text-lg'] },
  h4: { fontSize: typography.Size['text-base'] },
  h5: { fontSize: typography.Size['text-sm'] },
  h6: { fontSize: typography.Size['text-xs'] },
}))
