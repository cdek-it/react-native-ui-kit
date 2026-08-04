import { createContext, useLayoutEffect, type ReactNode } from 'react'

import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles'

import { SkeletonContextProvider } from '../utils/SkeletonContext'

import { darkTheme } from './darkTheme'
import { lightTheme } from './lightTheme'
import {
  componentTokens,
  fontTokens,
  semanticTokens,
  type ComponentTokens,
  type SemanticTokens,
} from './tokens'
import {
  type FontsConfig,
  type FontTokens,
  type ThemeType,
  ThemeVariant,
} from './types'

type InternalTheme = Omit<ThemeType, 'fonts' | 'semantic'> & {
  components: ComponentTokens
  fonts: FontsConfig & FontTokens
  semantic: ThemeType['semantic'] & SemanticTokens
}

const createInternalTheme = (
  theme: ThemeType,
  components: ComponentTokens
): InternalTheme => ({
  ...theme,
  components,
  fonts: {
    ...fontTokens,
    ...theme.fonts,
    fontFamily: { base: theme.fonts.secondary, heading: theme.fonts.primary },
  },
  semantic: { ...semanticTokens, ...theme.semantic },
})

const internalThemes = {
  light: createInternalTheme(lightTheme, componentTokens.light),
  dark: createInternalTheme(darkTheme, componentTokens.dark),
}

StyleSheet.configure({
  settings: { initialTheme: 'light' },
  themes: internalThemes,
})

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: (typeof internalThemes)['light']
    dark: (typeof internalThemes)['dark']
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
      const updateFonts = (theme: InternalTheme): InternalTheme => ({
        ...theme,
        fonts: {
          ...theme.fonts,
          ...fonts,
          fontFamily: { base: fonts.secondary, heading: fonts.primary },
        },
      })

      UnistylesRuntime.updateTheme('light', updateFonts)
      UnistylesRuntime.updateTheme('dark', updateFonts)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial* props применяем только на mount
  }, [])

  return (
    <ThemeContext.Provider value={null}>
      <SkeletonContextProvider>{children}</SkeletonContextProvider>
    </ThemeContext.Provider>
  )
}
