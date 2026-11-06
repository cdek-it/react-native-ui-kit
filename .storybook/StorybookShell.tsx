import type { ReactNode } from 'react'
import { Appearance } from 'react-native'

import { ThemeContextProvider, ThemeVariant } from '../src/theme'

const initialTheme =
  Appearance.getColorScheme() === 'dark'
    ? ThemeVariant.Dark
    : ThemeVariant.Light

export const StorybookShell = ({ children }: { children: ReactNode }) => (
  <ThemeContextProvider initialTheme={initialTheme}>
    {children}
  </ThemeContextProvider>
)
