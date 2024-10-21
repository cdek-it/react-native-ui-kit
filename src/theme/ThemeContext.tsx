import React, { type ReactNode, createContext, useCallback, useMemo, useState } from 'react'

import { type FontConfig, ThemeVariant } from './types'

interface ThemeContextType {
  theme: ThemeVariant
  changeTheme: (theme: ThemeVariant) => void
  fontConfig?: FontConfig
}

interface ThemeContextProviderProps {
  initialTheme?: ThemeVariant
  children: ReactNode
}

const defaultThemeContext = {
  theme: ThemeVariant.Light,
  changeTheme: () => {
    /* do nothing */
  },
  fontConfig: {
    italic: {
      100: 'Roboto-ThinItalic',
      200: 'Roboto-ThinItalic',
      300: 'Roboto-LightItalic',
      400: 'Roboto-RegularItalic',
      500: 'Roboto-MediumItalic',
      600: 'Roboto-MediumItalic',
      700: 'Roboto-BoldItalic',
      800: 'Roboto-BoldItalic',
      900: 'Roboto-BlackItalic',
    },
    normal: {
      100: 'Roboto-Thin',
      200: 'Roboto-Thin',
      300: 'Roboto-Light',
      400: 'Roboto-Regular',
      500: 'Roboto-Medium',
      600: 'Roboto-Medium',
      700: 'Roboto-Bold',
      800: 'Roboto-Bold',
      900: 'Roboto-Black',
    },
  },
}
export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext)

export const ThemeContextProvider = ({
  children,
  initialTheme = ThemeVariant.Light,
}: ThemeContextProviderProps) => {
  const [theme, setTheme] = useState(initialTheme)

  const changeTheme = useCallback((nextTheme: ThemeVariant) => {
    setTheme(nextTheme)
  }, [])

  const contextValue = useMemo(() => ({ theme, changeTheme }), [theme, changeTheme])

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}
