import {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { StyleSheet, UnistylesRuntime } from '../utils'
import { SkeletonContextProvider } from '../utils/SkeletonContext'

import { darkTheme as defaultDarkTheme } from './darkTheme'
import { lightTheme as defaultLightTheme } from './lightTheme'
import { ThemeVariant, type FontsConfig, type ThemeType } from './types'

const THEME_NAME_MAP: Record<ThemeVariant, 'light' | 'dark'> = {
  [ThemeVariant.Light]: 'light',
  [ThemeVariant.Dark]: 'dark',
}

export interface ThemeContextType {
  changeTheme: (theme: ThemeVariant) => void
}

export interface ThemeContextProviderProps {
  readonly initialTheme?: ThemeVariant
  readonly fonts?: FontsConfig
  readonly lightTheme?: ThemeType
  readonly darkTheme?: ThemeType
  readonly children: ReactNode
}

const withFonts = (theme: ThemeType, fonts?: FontsConfig): ThemeType =>
  fonts ? { ...theme, fonts } : theme

export const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeContextProvider = ({
  children,
  initialTheme = ThemeVariant.Light,
  fonts,
  lightTheme = defaultLightTheme,
  darkTheme = defaultDarkTheme,
}: ThemeContextProviderProps) => {
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    setTheme(initialTheme)
  }, [initialTheme])

  const configuredLightTheme = useMemo(
    () => withFonts(lightTheme, fonts),
    [fonts, lightTheme]
  )
  const configuredDarkTheme = useMemo(
    () => withFonts(darkTheme, fonts),
    [darkTheme, fonts]
  )

  useLayoutEffect(() => {
    StyleSheet.configure({
      settings: { initialTheme: THEME_NAME_MAP[theme] },
      themes: { light: configuredLightTheme, dark: configuredDarkTheme },
    })

    UnistylesRuntime.setTheme(THEME_NAME_MAP[theme])
  }, [configuredDarkTheme, configuredLightTheme, theme])

  const changeTheme = useCallback((nextTheme: ThemeVariant) => {
    setTheme(nextTheme)
  }, [])

  const contextValue = useMemo<ThemeContextType>(
    () => ({ changeTheme }),
    [changeTheme]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <SkeletonContextProvider>{children}</SkeletonContextProvider>
    </ThemeContext.Provider>
  )
}
