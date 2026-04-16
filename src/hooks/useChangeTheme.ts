import { useCallback } from 'react'

import { ThemeVariant } from '../theme'
import { UnistylesRuntime } from '../utils'

const THEME_MAP: Record<ThemeVariant, 'light' | 'dark'> = {
  [ThemeVariant.Light]: 'light',
  [ThemeVariant.Dark]: 'dark',
}

export const useChangeTheme = () => {
  return useCallback((theme: ThemeVariant) => {
    UnistylesRuntime.setTheme(THEME_MAP[theme])
  }, [])
}
