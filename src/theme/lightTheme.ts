import { customLight } from './assets/customLight'
import lightThemeAssets from './assets/themeLight.json'
import { commonTheme } from './commonTheme'
import type { ThemeType } from './types'

export const lightTheme: ThemeType = {
  theme: { ...lightThemeAssets, custom: customLight },
  ...commonTheme,
}
