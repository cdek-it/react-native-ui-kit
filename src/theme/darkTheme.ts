import { InputSize } from './assets/InputSize'
import darkThemeAssets from './assets/themeDark.json'
import { commonTheme } from './commonTheme'
import type { ThemeType } from './types'

export const darkTheme: ThemeType = {
  theme: { ...darkThemeAssets, InputSize },
  ...commonTheme,
  fonts: { primary: 'TT Fellows', secondary: 'Noto Sans' },
}
