import type { FontsConfig } from '../theme'
import { useUnistyles } from '../utils'

/**
 * Возвращает конфигурацию шрифтов.
 *
 * @deprecated Используйте `useUnistyles().theme.fonts` или `StyleSheet.create(...)`
 * из SDK.
 * Будет удалён в следующей minor версии.
 */
export const useFonts = (): FontsConfig => {
  const { theme } = useUnistyles()

  return theme.fonts
}
