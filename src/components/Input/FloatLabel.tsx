import { memo } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'

import { InputTextBase } from './InputTextBase/InputTextBase'
import type { InputTextBaseProps } from './InputTextBase/types'

export interface FloatLabelProps extends InputTextBaseProps {
  /** Текст плейсхолдера */
  placeholder: string
  /** Показать индикатор загрузки в поле */
  loading?: boolean
  /** Дополнительная стилизация для контейнера компонента */
  style?: StyleProp<ViewStyle>
}

/**
 * Компонент для ввода текста с плавающим плейсхолдером
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=2168-9279
 * @see InputTextBaseProps
 * @deprecated Используйте {@link InputText} с `floatLabel={true}`
 */
export const FloatLabel = memo<FloatLabelProps>(({ style, ...otherProps }) => {
  return (
    <View style={style}>
      <InputTextBase {...otherProps} />
    </View>
  )
})

export const FloatLabelTestId = {
  root: 'FloatLabel',
  pressable: 'PressableContainer',
  placeholder: 'Placeholder',
}
