import React, { memo } from 'react'
import { View, type ViewStyle } from 'react-native'

import { InputTextBase, type InputTextBaseProps } from './InputTextBase'

export interface InputTextProps extends InputTextBaseProps {
  /** Дополнительная стилизация для контейнера компонента */
  style?: ViewStyle
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
