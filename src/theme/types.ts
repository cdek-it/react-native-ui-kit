import type { TextStyle } from 'react-native'

import type { LegacyFontAliases, LegacyTheme } from './legacyTokens'
import type lightComponentTokens from './tokens/components/light.json'
import type fontTokens from './tokens/fonts.json'
import type lightSemanticColorSchemeTokens from './tokens/semantic/colorScheme/light.json'
import type semanticDimensions from './tokens/semantic/dimensions.json'
import type semanticEffects from './tokens/semantic/effects.json'

export interface RuntimeTheme {
  semantic: {
    colorScheme: typeof lightSemanticColorSchemeTokens
    dimension: typeof semanticDimensions
    effects: typeof semanticEffects
  }
  components: typeof lightComponentTokens
  fonts: FontTokens
}

export type ThemeType = RuntimeTheme &
  LegacyTheme & { fonts: FontTokens & LegacyFontAliases }

export enum ThemeVariant {
  Light = 'Light',
  Dark = 'Dark',
}

export type FontTokens = Omit<typeof fontTokens, 'fontWeight'> & {
  fontWeight: Record<
    keyof typeof fontTokens.fontWeight,
    TextStyle['fontWeight']
  >
}

export type {
  FontsConfig,
  FontsConfigType,
  LegacyFontAliases,
} from './legacyTokens'
