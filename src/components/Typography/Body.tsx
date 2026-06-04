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

const styles = StyleSheet.create(({ theme, typography, fonts }) => ({
  text: {
    fontSize: typography.Size['text-base'],
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.secondary,
    lineHeight: 20,
  },
  regular: { fontWeight: 400 },
  bold: { fontWeight: 700, letterSpacing: -0.5 },
  default: { color: theme.General.textColor },
  primary: { color: theme.General.primaryColor },
  secondary: { color: theme.General.textSecondaryColor },
  base: { fontSize: typography.Size['text-sm'], lineHeight: 18 },
  paragraph: { lineHeight: 24 },
  paragraphBase: { lineHeight: 21 },
  disabled: { opacity: 0.6 },
}))
