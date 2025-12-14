import {
  type ReactNode,
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react'

import { SkeletonContextProvider } from '../utils/SkeletonContext'

import { ThemeVariant, type FontsConfig } from './types'

interface ThemeContextType {
  theme: ThemeVariant
  fonts: FontsConfig
  changeTheme: (theme: ThemeVariant) => void
}

interface ThemeContextProviderProps {
  readonly initialTheme?: ThemeVariant
  readonly fonts?: FontsConfig
  readonly children: ReactNode
}

const defaultThemeContext: ThemeContextType = {
  theme: ThemeVariant.Light,
  fonts: { primary: 'TT Fellows', secondary: 'PT Sans' },
  changeTheme: () => {
    /* do nothing */
  },
}
export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext)

export const ThemeContextProvider = ({
  children,
  initialTheme = defaultThemeContext.theme,
  fonts = defaultThemeContext.fonts,
}: ThemeContextProviderProps) => {
  const [theme, setTheme] = useState(initialTheme)

  const changeTheme = useCallback((nextTheme: ThemeVariant) => {
    setTheme(nextTheme)
  }, [])

  const contextValue = useMemo(
    () => ({ theme, fonts, changeTheme }),
    [theme, fonts, changeTheme]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <SkeletonContextProvider>{children}</SkeletonContextProvider>
    </ThemeContext.Provider>
  )
}
