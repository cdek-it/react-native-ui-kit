import { Text, type TextProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

export interface TitleProps extends TextProps {
  readonly level: 'd1' | 'd2' | 'd3' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const Title = ({ level, style, ...other }: TitleProps) => (
  <Text style={[styles.text, styles[level], style]} testID='Title' {...other} />
)

const styles = StyleSheet.create(({ theme, typography, fonts }) => ({
  text: {
    color: theme.General.textColor,
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
  h6: { fontSize: typography.Size['text-xs'], lineHeight: 12 },
}))
