import { StyleSheet } from 'react-native-unistyles'

import { darkTheme } from './darkTheme'
import { lightTheme } from './lightTheme'

StyleSheet.configure({
  settings: { initialTheme: 'light' },
  themes: { light: lightTheme, dark: darkTheme },
})

export { darkTheme, lightTheme }
export {
  type ThemeType,
  ThemeVariant,
  type FontsConfigType,
  type FontsConfig,
} from './types'

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: typeof lightTheme
    dark: typeof darkTheme
  }
}
