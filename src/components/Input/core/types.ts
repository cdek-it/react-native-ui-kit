import type { ReactNode, Ref } from 'react'
import type {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
  PressableProps,
} from 'react-native'

export type InputTextSize = 'small' | 'base' | 'large' | 'xlarge'
export type InputState = 'default' | 'danger'
export type RenderTextInputArgs = TextInputProps & { inputRef: Ref<TextInput> }

export interface InputLabelInfo {
  /** Обработчик нажатия на label с иконкой ⓘ */
  onPress: NonNullable<PressableProps['onPress']>
  /**
   * Название действия для скринридера; добавляется после текста label
   * @default Подробнее
   */
  accessibilityLabel?: string
}

export type InputLabelProps =
  | {
      /** Постоянная подпись над полем; скринридер читает её в имени поля */
      label?: string
      floatLabel?: never
      labelInfo?: never
    }
  | {
      label: string
      floatLabel?: never
      /** Label с иконкой ⓘ читается отдельной кнопкой; имя поля сохраняется */
      labelInfo?: InputLabelInfo
    }
  | {
      label?: never
      labelInfo?: never
      /**
       * Подпись внутри пустого поля, поднимающаяся при фокусе или наличии значения.
       * Взаимоисключающая с label. Отдельный placeholder появляется при фокусе
       * пустого поля; дублировать в нём текст floatLabel не требуется.
       */
      floatLabel: string
    }

/**
 * Общий RN-контракт: для режима чтения используется readOnly вместо editable.
 * При заданном value обновляйте его через onChangeText.
 * Без value компонент хранит значение сам; defaultValue задаёт начальное значение.
 */
export interface InputNativeProps extends Omit<
  TextInputProps,
  'style' | 'editable' | 'children' | 'clearButtonMode' | 'aria-disabled'
> {
  /** Методы TextInput; clear() вызывает onChangeText('') с учётом controlled-режима. */
  ref?: Ref<TextInput | null>
  /**
   * Имя для скринридера; по умолчанию label, floatLabel или placeholder
   * При required добавляется «обязательное поле», при danger — «ошибка»
   */
  accessibilityLabel?: TextInputProps['accessibilityLabel']
  /**
   * Строка или число оборачиваются в InputCaption; нода отображается как передана.
   * Для статуса подписи передайте InputCaption с нужным variant.
   * Подпись доступна скринридеру отдельно от поля
   */
  caption?: ReactNode
  /**
   * Показывает * у подписи и добавляет «обязательное поле» к имени поля для скринридера
   */
  required?: boolean
  /** @default 'base' */
  size?: InputTextSize
  /**
   * Валидация поля: default или danger.
   * В Figma readonly и disabled соответствуют readOnly и disabled;
   * focus отслеживается полем, hover не применяется в RN.
   * @default 'default'
   */
  state?: InputState
  /**
   * Отключает поле и все встроенные действия.
   * Имеет приоритет над readOnly.
   * @default false
   */
  disabled?: boolean
  /**
   * Запрещает редактирование и очистку, сохраняя доступность остальных действий
   * @default false
   */
  readOnly?: boolean
  /**
   * Очистка доступна при непустом редактируемом поле и вызывает onChangeText('')
   * @default true
   */
  clearable?: boolean
  /** Внешний контейнер: размеры и отступы */
  style?: StyleProp<ViewStyle>
  /** Стиль нативного ввода */
  inputStyle?: StyleProp<TextStyle>
  /**
   * Адаптер нативного ввода: передайте полученные props и inputRef в свой TextInput.
   * editable в этих props вычислен из readOnly и disabled для совместимости адаптеров.
   */
  renderTextInput?: (props: RenderTextInputArgs) => ReactNode
}
