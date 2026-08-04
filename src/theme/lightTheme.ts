import { InputSize } from './assets/InputSize'
import { ModalSize } from './assets/ModalSize'
import { customLight } from './assets/customLight'
import lightThemeAssets from './assets/themeLight.json'
import { commonTheme } from './commonTheme'
import lightSemanticColorSchemeTokens from './tokens/semantic/colorScheme/light.json'
import type { ThemeType } from './types'

export const lightTheme: ThemeType = {
  semantic: { colorScheme: lightSemanticColorSchemeTokens },
  theme: { ...lightThemeAssets, InputSize, ModalSize, custom: customLight },
  ...commonTheme,
  fonts: { primary: 'TT Fellows', secondary: 'Noto Sans' },
}
