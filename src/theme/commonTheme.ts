import background from './assets/background.json'
import border from './assets/border.json'
import { customCommon } from './assets/customCommon'
import effects from './assets/effects.json'
import global from './assets/global.json'
import primaryColors from './assets/primaryColors.json'
import { shadow } from './assets/shadow'
import sizing from './assets/sizing.json'
import spacing from './assets/spacing.json'
import typography from './assets/typography.json'
import fontTokens from './tokens/fonts.json'
import type { FontPrimitives } from './types'

// JSON отдаёт fontWeight как number, а TextStyle требует литеральный тип.
// Значения совпадают, различается только их представление в типах.
const fonts = fontTokens as FontPrimitives

export const commonTheme = {
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
  primitive: { fonts },
  // Публичный FontsConfig оперирует ролями primary/secondary, токены — base/heading.
  fonts: {
    primary: fonts.fontFamily.heading,
    secondary: fonts.fontFamily.base,
  },
}
