import type { InputLabelProps, InputNativeProps } from '../core/types'

export type PasswordProps = Omit<
  InputNativeProps,
  'secureTextEntry' | 'multiline' | 'clearable'
> &
  InputLabelProps & {
    /**
     * Показывает кнопку очистки непустого редактируемого поля.
     * @default false
     */
    clearable?: boolean
    /**
     * Показывает кнопку переключения видимости пароля.
     * Переключение видимости сохраняет значение поля.
     * @default true
     */
    toggleMask?: boolean
  }
