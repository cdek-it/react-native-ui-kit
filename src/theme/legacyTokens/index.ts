import { InputSize } from './InputSize'
import { ModalSize } from './ModalSize'
import background from './background.json'
import border from './border.json'
import { customCommon } from './customCommon'
import { customDark } from './customDark'
import { customLight } from './customLight'
import effects from './effects.json'
import global from './global.json'
import primaryColors from './primaryColors.json'
import { shadow } from './shadow'
import sizing from './sizing.json'
import spacing from './spacing.json'
import darkTheme from './themeDark.json'
import lightTheme from './themeLight.json'
import typography from './typography.json'

interface FontFamilyTokens {
  base: string
  heading: string
}

export interface LegacyFontAliases {
  /** @deprecated Используйте `fonts.fontFamily.heading`. */
  primary: string
  /** @deprecated Используйте `fonts.fontFamily.base`. */
  secondary: string
}

export type FontsConfig = FontFamilyTokens | LegacyFontAliases

export interface FontsConfigType {
  fonts: FontsConfig
}

export interface LegacyTheme {
  /** @deprecated Используйте `semantic` или `components`. */
  background: typeof background
  /** @deprecated Используйте `semantic` или `components`. */
  colors: { primary: typeof primaryColors }
  /** @deprecated Используйте `semantic` или `components`. */
  border: typeof border
  /** @deprecated Используйте `semantic.effects`. */
  effects: typeof effects
  /** @deprecated Используйте `semantic`, `components` или `fonts`. */
  global: typeof global
  /** @deprecated Используйте `semantic` или `components`. */
  sizing: typeof sizing
  /** @deprecated Используйте `semantic` или `components`. */
  spacing: typeof spacing
  /** @deprecated Используйте `semantic` или `components`. */
  theme: typeof lightTheme & {
    custom: typeof customLight
    InputSize: typeof InputSize
    ModalSize: typeof ModalSize
  }
  /** @deprecated Используйте `fonts`. */
  typography: typeof typography
  /** @deprecated Используйте `semantic` или `components`. */
  custom: typeof customCommon
  /** @deprecated Используйте `semantic.effects`. */
  shadow: typeof shadow
}

const commonLegacyTokens: Omit<LegacyTheme, 'theme'> = {
  background,
  colors: { primary: primaryColors },
  border,
  effects,
  global,
  sizing,
  spacing,
  typography,
  custom: customCommon,
  shadow,
}

const legacyThemes = {
  light: {
    theme: { ...lightTheme, InputSize, ModalSize, custom: customLight },
    ...commonLegacyTokens,
  },
  dark: {
    theme: { ...darkTheme, InputSize, ModalSize, custom: customDark },
    ...commonLegacyTokens,
  },
} satisfies Record<'light' | 'dark', LegacyTheme>

const toFontFamilyTokens = (fonts: FontsConfig): FontFamilyTokens => {
  if (!('primary' in fonts)) {
    return fonts
  }

  const aliases = fonts as Record<'primary' | 'secondary', string>

  return { base: aliases.secondary, heading: aliases.primary }
}

const toLegacyFontAliases = ({
  base,
  heading,
}: FontFamilyTokens): LegacyFontAliases => ({
  primary: heading,
  secondary: base,
})

export const applyFontConfig = <
  T extends { fonts: { fontFamily: FontFamilyTokens } },
>(
  theme: T,
  fonts: FontsConfig
) => {
  const fontFamily = { ...theme.fonts.fontFamily, ...toFontFamilyTokens(fonts) }

  return {
    ...theme,
    fonts: { ...theme.fonts, fontFamily, ...toLegacyFontAliases(fontFamily) },
  }
}

export const withLegacyTokens = <
  T extends { fonts: { fontFamily: FontFamilyTokens } },
>(
  theme: T,
  colorScheme: keyof typeof legacyThemes
) => ({
  ...theme,
  ...legacyThemes[colorScheme],
  fonts: { ...theme.fonts, ...toLegacyFontAliases(theme.fonts.fontFamily) },
})
