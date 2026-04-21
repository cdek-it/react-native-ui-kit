import { createContext, useLayoutEffect, type ReactNode } from 'react'

import { StyleSheet, UnistylesRuntime } from '../utils'
import { SkeletonContextProvider } from '../utils/SkeletonContext'

import { darkTheme } from './darkTheme'
import { lightTheme } from './lightTheme'
import { type FontsConfig, ThemeVariant } from './types'

StyleSheet.configure({
  settings: { initialTheme: 'light' },
  themes: { light: lightTheme, dark: darkTheme },
})

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: typeof lightTheme
    dark: typeof darkTheme
  }
}

const THEME_NAME_MAP: Record<ThemeVariant, 'light' | 'dark'> = {
  [ThemeVariant.Light]: 'light',
  [ThemeVariant.Dark]: 'dark',
}

export interface ThemeContextProviderProps {
  readonly initialTheme?: ThemeVariant
  readonly fonts?: FontsConfig
  readonly children: ReactNode
}

export const ThemeContext = createContext<null>(null)

export const ThemeContextProvider = ({
  children,
  initialTheme = ThemeVariant.Light,
  fonts,
}: ThemeContextProviderProps) => {
  useLayoutEffect(() => {
    UnistylesRuntime.setTheme(THEME_NAME_MAP[initialTheme])

    if (fonts) {
      UnistylesRuntime.updateTheme('light', (t) => ({ ...t, fonts }))
      UnistylesRuntime.updateTheme('dark', (t) => ({ ...t, fonts }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial* props применяем только на mount
  }, [])

  return (
    <ThemeContext.Provider value={null}>
      <SkeletonContextProvider>{children}</SkeletonContextProvider>
    </ThemeContext.Provider>
  )
}
