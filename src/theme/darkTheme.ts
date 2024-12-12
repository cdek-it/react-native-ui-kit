import { customDark } from './assets/customDark'
import darkThemeAssets from './assets/themeDark.json'
import { commonTheme } from './commonTheme'
import type { ThemeType } from './types'

export const darkTheme: ThemeType = {
  theme: {
    ...darkThemeAssets,
    custom: customDark,
  },
  ...commonTheme,
}
