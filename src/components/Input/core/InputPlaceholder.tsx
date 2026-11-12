import {
  Text,
  type TextInputProps,
  type StyleProp,
  type TextStyle,
} from 'react-native'

import { styles } from './styles'

interface InputPlaceholderProps {
  readonly nativeProps: TextInputProps
  readonly style: StyleProp<TextStyle>
  readonly isHidden: boolean
  readonly isDanger: boolean
  readonly testID: string
  readonly onLayout?: TextInputProps['onLayout']
}

export const InputPlaceholder = ({
  nativeProps,
  style,
  isHidden,
  isDanger,
  testID,
  onLayout,
}: InputPlaceholderProps) =>
  nativeProps.placeholder ? (
    <Text
      accessibilityElementsHidden
      accessible={false}
      allowFontScaling={nativeProps.allowFontScaling}
      importantForAccessibility='no-hide-descendants'
      maxFontSizeMultiplier={nativeProps.maxFontSizeMultiplier}
      pointerEvents='none'
      style={[
        style,
        styles.placeholder,
        styles.placeholderText,
        isDanger && styles.dangerPlaceholder,
        nativeProps.placeholderTextColor && {
          color: nativeProps.placeholderTextColor,
        },
        isHidden && styles.hidden,
      ]}
      testID={testID}
      onLayout={onLayout}
    >
      {nativeProps.placeholder}
    </Text>
  ) : null
