import type { PressableProps } from 'react-native'

export interface ToggleSwitchProps extends Omit<
  PressableProps,
  'children' | 'accessible' | 'accessibilityRole' | 'role' | 'aria-checked'
> {
  /** Текущее значение. Меняется только при обновлении prop */
  checked: boolean
  /**
   * Блокирует нажатия
   * @default false
   */
  disabled?: boolean
  /**
   * Сообщает ожидаемое следующее значение после нажатия
   * Компонент не меняет checked самостоятельно и не ожидает результат callback
   */
  onCheckedChange?: (checked: boolean) => void
  /**
   * Отрисовка danger состояния
   * @default false
   */
  danger?: boolean
  /**
   * Текст справа от переключателя
   * Попадает в accessibilityLabel по умолчанию
   */
  label?: string
  /**
   * Подпись под label. Без label не отображается
   * Добавляется accessibilityHint по умолчанию
   */
  caption?: string
}
