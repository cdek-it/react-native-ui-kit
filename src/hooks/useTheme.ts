import { ThemeVariant } from '../theme'
import { UnistylesRuntime } from '../utils'

/**
 * Возвращает текущую тему.
 *
 * @deprecated Используйте `UnistylesRuntime.themeName` из SDK.
 *
 * Для реактивного поведения: `useUnistyles().rt.themeName`.
 * Будет удалён в следующей minor версии.
 */
export const useTheme = (): ThemeVariant =>
  UnistylesRuntime.themeName === 'dark' ? ThemeVariant.Dark : ThemeVariant.Light
