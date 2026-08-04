import type { TextStyle } from 'react-native'

import type { InputSize } from './assets/InputSize'
import type { ModalSize } from './assets/ModalSize'
import type background from './assets/background.json'
import type border from './assets/border.json'
import type { customCommon } from './assets/customCommon'
import type { customLight } from './assets/customLight'
import type effects from './assets/effects.json'
import type global from './assets/global.json'
import type primaryColors from './assets/primaryColors.json'
import type { shadow } from './assets/shadow'
import type sizing from './assets/sizing.json'
import type spacing from './assets/spacing.json'
import type lightTheme from './assets/themeLight.json'
import type typography from './assets/typography.json'
import type fontTokens from './tokens/fonts.json'
import type lightSemanticColorSchemeTokens from './tokens/semantic/colorScheme/light.json'

export interface ThemeType {
  background: typeof background
  colors: { primary: typeof primaryColors }
  border: typeof border
  effects: typeof effects
  global: typeof global
  sizing: typeof sizing
  spacing: typeof spacing
  semantic: { colorScheme: typeof lightSemanticColorSchemeTokens }
  theme: typeof lightTheme & {
    custom: typeof customLight
    InputSize: typeof InputSize
    ModalSize: typeof ModalSize
  }
  typography: typeof typography
  custom: typeof customCommon
  shadow: typeof shadow
  fonts: FontsConfig
}

export enum ThemeVariant {
  Light = 'Light',
  Dark = 'Dark',
}

export interface FontsConfig {
  primary: string
  secondary: string
}

export interface FontsConfigType {
  fonts: FontsConfig
}

export type FontTokens = Omit<typeof fontTokens, 'fontWeight'> & {
  fontWeight: Record<
    keyof typeof fontTokens.fontWeight,
    TextStyle['fontWeight']
  >
}
