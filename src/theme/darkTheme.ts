import { InputSize } from './assets/InputSize'
import { ModalSize } from './assets/ModalSize'
import { customDark } from './assets/customDark'
import darkThemeAssets from './assets/themeDark.json'
import { commonTheme } from './commonTheme'
import darkSemanticColorSchemeTokens from './tokens/semantic/colorScheme/dark.json'
import type { ThemeType } from './types'

export const darkTheme: ThemeType = {
  semantic: { colorScheme: darkSemanticColorSchemeTokens },
  theme: { ...darkThemeAssets, InputSize, ModalSize, custom: customDark },
  ...commonTheme,
  fonts: { primary: 'TT Fellows', secondary: 'Noto Sans' },
}
