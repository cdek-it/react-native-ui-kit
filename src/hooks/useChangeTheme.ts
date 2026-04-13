import { useCallback } from 'react'
import { UnistylesRuntime } from 'react-native-unistyles'

import { ThemeVariant } from '../theme'

const THEME_MAP: Record<ThemeVariant, 'light' | 'dark'> = {
  [ThemeVariant.Light]: 'light',
  [ThemeVariant.Dark]: 'dark',
}

/**
 * Возвращает callback для переключения темы.
 *
 * @deprecated Используйте `UnistylesRuntime.setTheme` из SDK напрямую.
 * Будет удалён в следующей minor версии.
 */
export const useChangeTheme = () => {
  return useCallback((theme: ThemeVariant) => {
    UnistylesRuntime.setTheme(THEME_MAP[theme])
  }, [])
}
