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

// TODO(tokens-migration): reason=missing; legacy=semantic.colorScheme.color.fg.default; light=#2b2e33; dark=#ffffff
// TODO(tokens-migration): reason=missing; legacy=semantic.colorScheme.color.fg.brand.default; light=#44e858; dark=#77f48a
// TODO(tokens-migration): reason=missing; legacy=semantic.colorScheme.color.fg.muted; light=#85888e; dark=#a2a5a9
// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-base; value=14
// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-sm; value=12.25
const styles = StyleSheet.create(({ semantic, typography, fonts }) => ({
  text: {
    fontSize: typography.Size['text-base'],
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.secondary,
    lineHeight: 20,
  },
  regular: { fontWeight: 400 },
  bold: { fontWeight: 700, letterSpacing: -0.5 },
  default: { color: semantic.colorScheme.color.fg.default },
  primary: { color: semantic.colorScheme.color.fg.brand.default },
  secondary: { color: semantic.colorScheme.color.fg.muted },
  base: { fontSize: typography.Size['text-sm'], lineHeight: 18 },
  paragraph: { lineHeight: 24 },
  paragraphBase: { lineHeight: 21 },
  disabled: { opacity: 0.6 },
}))
