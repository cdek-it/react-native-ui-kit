import { InputSize } from './assets/InputSize'
import { ModalSize } from './assets/ModalSize'
import { customDark } from './assets/customDark'
import darkThemeAssets from './assets/themeDark.json'
import { commonTheme } from './commonTheme'
import type { ThemeType } from './types'

export const darkTheme: ThemeType = {
  theme: { ...darkThemeAssets, InputSize, ModalSize, custom: customDark },
  ...commonTheme,
}
