import { useCallback, useContext } from 'react'

import { ThemeContext, ThemeVariant } from '../theme'
import { UnistylesRuntime } from '../utils'

const THEME_MAP: Record<ThemeVariant, 'light' | 'dark'> = {
  [ThemeVariant.Light]: 'light',
  [ThemeVariant.Dark]: 'dark',
}

export const useChangeTheme = () => {
  const themeContext = useContext(ThemeContext)
  const fallbackChangeTheme = useCallback((theme: ThemeVariant) => {
    UnistylesRuntime.setTheme(THEME_MAP[theme])
  }, [])

  return themeContext?.changeTheme ?? fallbackChangeTheme
}
