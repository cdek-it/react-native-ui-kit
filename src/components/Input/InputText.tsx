import { memo } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'

import { InputTextBase } from './InputTextBase/InputTextBase'
import type { InputTextBaseProps } from './InputTextBase/types'

export interface InputTextProps extends InputTextBaseProps {
  /** Дополнительная стилизация для контейнера компонента */
  style?: StyleProp<ViewStyle>
}

/**
 * Компонент для ввода текста
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-5470&m=dev
 * @see InputTextBase
 * @see InputTextBaseProps
 */
export const InputText = memo<InputTextProps>(({ style, ...otherProps }) => {
  return (
    <View style={style}>
      <InputTextBase {...otherProps} />
    </View>
  )
})
