import { InputSize } from './assets/InputSize'
import { ModalSize } from './assets/ModalSize'
import { customLight } from './assets/customLight'
import lightThemeAssets from './assets/themeLight.json'
import { commonTheme } from './commonTheme'
import lightComponentTokens from './tokens/components/light.json'
import lightSemanticTokens from './tokens/semantic/light.json'
import type { ThemeType } from './types'

export const lightTheme: ThemeType = {
  semantic: lightSemanticTokens,
  components: lightComponentTokens,
  theme: { ...lightThemeAssets, InputSize, ModalSize, custom: customLight },
  ...commonTheme,
}
