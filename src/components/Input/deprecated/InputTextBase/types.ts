import type { Ref, ReactNode } from 'react'
import type {
  TextInputProps,
  ViewStyle,
  TextInput,
  StyleProp,
  Insets,
} from 'react-native'

import type { useMakeTestId } from '../../../../hooks/useMakeTestId'

export type { InputTextCompatibilityProps as InputTextBaseProps } from '../types'

export type InputTextSize = 'small' | 'base' | 'large' | 'xlarge'

/** @see TextInputProps */
export interface InputTextCoreProps extends Omit<TextInputProps, 'style'> {
  /**
   * Управление отображения иконки очистки поля
   * @default true
   */
  clearable?: boolean
  /** Локализованное имя кнопки очистки. По умолчанию «Очистить поле» */
  clearButtonAccessibilityLabel?: string
  /** Управление стилем контейнера поля ввода */
  containerStyle?: StyleProp<ViewStyle>
  /** Управление доступностью поля */
  disabled?: boolean
  /** Ref для управления полем ввода */
  inputRef?: Ref<TextInput | null>
  /**
   * Функция для рендера поля ввода.
   * Используется, когда необходимо использовать отличный от стандартного компонент.
   * Например, для реализации масок
   */
  renderTextInput?: (props: RenderTextInputArgs) => ReactNode
  /** Управление состоянием компонента */
  state?: 'default' | 'danger'
  /**
   * Управляет видом плейсхолдера в компоненте
   * @default false
   */
  floatLabel?: boolean
  /**
   * Высота поля без floating label. small и base временно имеют одинаковую высоту.
   * @default 'base'
   */
  size?: InputTextSize
}

export type RenderTextInputArgs = TextInputProps & { inputRef: Ref<TextInput> }

export interface InputTextRightAccessoryArgs {
  readonly hitSlop: Insets
  readonly iconSize: { readonly width: number; readonly height: number }
  readonly makeTestId: ReturnType<typeof useMakeTestId>['makeTestId']
}

export type RenderInputTextRightAccessory = (
  props: InputTextRightAccessoryArgs
) => ReactNode

export interface InputTextPrivateProps {
  /** Управление отображением иконки загрузки */
  loading?: boolean
  renderRightAccessory?: RenderInputTextRightAccessory
}
