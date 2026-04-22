import { Text, type TextProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

export interface BodyProps extends TextProps {
  readonly base?: boolean
  readonly color?: 'default' | 'secondary' | 'primary'
  readonly disabled?: boolean
  readonly paragraph?: boolean
  readonly weight?: 'regular' | 'medium' | 'bold'
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
    fontSize: typography.Size['text-lg'],
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.secondary,
  },
  regular: { fontWeight: 400 },
  medium: { fontWeight: 500 },
  bold: { fontWeight: 700 },
  default: { color: theme.General.textColor },
  primary: { color: theme.General.primaryColor },
  secondary: { color: theme.General.textSecondaryColor },
  base: { fontSize: typography.Size['text-base'] },
  paragraph: { fontSize: typography.Size['text-lg'] },
  paragraphBase: { fontSize: typography.Size['text-base'] },
  disabled: { opacity: 0.6 },
}))
