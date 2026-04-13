import { useUnistyles } from 'react-native-unistyles'

import type { FontsConfig } from '../theme'

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
