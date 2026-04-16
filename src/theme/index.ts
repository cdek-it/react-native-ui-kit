import { StyleSheet } from '../utils'

import { ThemeContext, ThemeContextProvider } from './ThemeContext'
import { darkTheme as defaultDarkTheme } from './darkTheme'
import { lightTheme as defaultLightTheme } from './lightTheme'

StyleSheet.configure({
  settings: { initialTheme: 'light' },
  themes: { light: defaultLightTheme, dark: defaultDarkTheme },
})

export { defaultDarkTheme as darkTheme, defaultLightTheme as lightTheme }
export { ThemeContext, ThemeContextProvider }
export type { ThemeContextProviderProps } from './ThemeContext'
export {
  type ThemeType,
  ThemeVariant,
  type FontsConfigType,
  type FontsConfig,
} from './types'

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: typeof defaultLightTheme
    dark: typeof defaultDarkTheme
  }
}
