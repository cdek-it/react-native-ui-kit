import { memo } from 'react'
import { Text, type StyleProp, type TextStyle } from 'react-native'

interface ButtonLabelProps {
  readonly label?: string
  readonly style: StyleProp<TextStyle>
}

export const ButtonLabel = memo<ButtonLabelProps>(({ label, style }) => (
  <Text style={style} testID='Button_Text'>
    {label}
  </Text>
))
