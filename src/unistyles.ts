import type { ThemeType } from './theme/types'

declare module 'react-native-unistyles' {
  interface UnistylesThemes {
    light: ThemeType
    dark: ThemeType
  }
}
