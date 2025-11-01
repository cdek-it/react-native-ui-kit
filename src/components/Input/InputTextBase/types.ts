import type { Ref, ReactNode } from 'react'
import type { TextInputProps, ViewStyle, TextInput } from 'react-native'

/** @see TextInputProps */
export interface InputTextBaseProps
  extends Omit<TextInputProps, 'style' | 'editable' | 'secureTextEntry'> {
  /**
   * Управление отображения иконки очистки поля
   * @default true
   */
  clearable?: boolean
  /**
   * Управление режимом скрытия текста
   * - `true` — всегда скрывать (как в TextInput)
   * - `false` — не скрывать
   * - `"toggleable"` — скрытие управляется пользователем через кнопку-глаз
   */
  secureTextEntry?: boolean | 'toggleable'
  /** Озвучка для кнопки очистки поля */
  clearButtonAccessibilityLabel?: string
  /** Управление стилем контейнера поля ввода */
  containerStyle?: ViewStyle
  /** Управление доступностью поля */
  disabled?: boolean
  /** Ref для управления полем ввода */
  inputRef?: Ref<TextInput | null>
  // Функция для рендера поля ввода.
  // Используется, когда необходимо использовать отличный от стандартного компонент.
  // Например, для реализации масок
  //
  renderTextInput?: (props: RenderTextInputArgs) => ReactNode
  /** Управление состоянием компонента */
  state?: 'default' | 'danger'
}

export type RenderTextInputArgs = TextInputProps & { inputRef: Ref<TextInput> }
