import { InputSize } from './assets/InputSize'
import { ModalSize } from './assets/ModalSize'
import { customDark } from './assets/customDark'
import darkThemeAssets from './assets/themeDark.json'
import { commonTheme } from './commonTheme'
import darkComponentTokens from './tokens/components/dark.json'
import darkSemanticTokens from './tokens/semantic/dark.json'
import type { ThemeType } from './types'

export const darkTheme: ThemeType = {
  semantic: darkSemanticTokens,
  components: darkComponentTokens,
  theme: { ...darkThemeAssets, InputSize, ModalSize, custom: customDark },
  ...commonTheme,
  fonts: { primary: 'TT Fellows', secondary: 'Noto Sans' },
}
