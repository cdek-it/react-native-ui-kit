import { InputSize } from './assets/InputSize'
import lightThemeAssets from './assets/themeLight.json'
import { commonTheme } from './commonTheme'
import type { ThemeType } from './types'

export const lightTheme: ThemeType = {
  theme: { ...lightThemeAssets, InputSize },
  ...commonTheme,
  fonts: { primary: 'TT Fellows', secondary: 'Noto Sans' },
}
