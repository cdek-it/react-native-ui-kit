import type { InputTextCoreProps, InputTextSize } from './InputTextBase/types'

/** @deprecated Используйте Password после его внедрения */
export type LegacySecureTextEntry = 'toggleable'

/** @deprecated Используйте base после согласованной миграции размеров в SuperApp */
export type LegacyMediumSize = 'medium'

/** @deprecated Используйте стандартный размер после миграции размеров в SuperApp */
export type LegacyNumericSize = number

export interface InputTextCompatibilityProps extends Omit<
  InputTextCoreProps,
  'size' | 'secureTextEntry'
> {
  /**
   * Управление режимом скрытия текста.
   * Boolean соответствует TextInput; toggleable сохраняется до перехода на Password.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Legacy API сохраняется до перехода на Password
  secureTextEntry?: boolean | LegacySecureTextEntry
  /**
   * Высота поля без floating label. small и base временно имеют одинаковую высоту.
   * medium и числовой размер устарели; число меньше base ограничивается высотой base.
   * @default 'base'
   */
  size?:
    | InputTextSize
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- Размер удаляется вместе с миграцией SuperApp
    | LegacyMediumSize
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- Размер удаляется вместе с миграцией SuperApp
    | LegacyNumericSize
}
