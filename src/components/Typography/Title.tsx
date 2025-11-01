import { Text, type TextProps } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

export interface TitleProps extends TextProps {
  readonly level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const Title = ({ level, style, ...other }: TitleProps) => {
  const styles = useStyles()

  return <Text style={[styles.text, styles[level], style]} {...other} />
}

const useStyles = makeStyles(({ theme }) => ({
  text: {
    color: theme.General.textColor,
    fontWeight: 700,
    includeFontPadding: false,
    verticalAlign: 'middle',
  },
  h1: { fontSize: 28 },
  h2: { fontSize: 21 },
  h3: { fontSize: 17.5 },
  h4: { fontSize: 15.75 },
  h5: { fontSize: 14 },
  h6: { fontSize: 12.25 },
}))
