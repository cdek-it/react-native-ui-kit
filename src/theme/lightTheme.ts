import { InputSize } from './assets/InputSize'
import { ModalSize } from './assets/ModalSize'
import { customLight } from './assets/customLight'
import lightThemeAssets from './assets/themeLight.json'
import { commonTheme } from './commonTheme'
import type { ThemeType } from './types'

export const lightTheme: ThemeType = {
  theme: { ...lightThemeAssets, InputSize, ModalSize, custom: customLight },
  ...commonTheme,
}
