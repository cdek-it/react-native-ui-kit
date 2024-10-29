import React, { type ReactNode, createContext, useCallback, useMemo, useState } from 'react'

import { ThemeVariant } from './types'

interface ThemeContextType {
  theme: ThemeVariant
  changeTheme: (theme: ThemeVariant) => void
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
