import { createContext, useLayoutEffect, type ReactNode } from 'react'

import { UnistylesRuntime } from '../utils'
import { SkeletonContextProvider } from '../utils/SkeletonContext'

import { ThemeVariant } from './types'

const THEME_NAME_MAP: Record<ThemeVariant, 'light' | 'dark'> = {
  [ThemeVariant.Light]: 'light',
  [ThemeVariant.Dark]: 'dark',
}

export interface ThemeContextProviderProps {
  readonly initialTheme?: ThemeVariant
  readonly children: ReactNode
}

export const ThemeContext = createContext<null>(null)

export const ThemeContextProvider = ({
  children,
  initialTheme = ThemeVariant.Light,
}: ThemeContextProviderProps) => {
  useLayoutEffect(() => {
    UnistylesRuntime.setTheme(THEME_NAME_MAP[initialTheme])
  }, [initialTheme])

  return (
    <ThemeContext.Provider value={null}>
      <SkeletonContextProvider>{children}</SkeletonContextProvider>
    </ThemeContext.Provider>
  )
}
