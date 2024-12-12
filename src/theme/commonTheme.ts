import background from './assets/background.json'
import border from './assets/border.json'
import { customCommon } from './assets/customCommon'
import effects from './assets/effects.json'
import global from './assets/global.json'
import primaryColors from './assets/primaryColors.json'
import secondaryColors from './assets/secondaryColors.json'
import sizing from './assets/sizing.json'
import spacing from './assets/spacing.json'
import typography from './assets/typography.json'

export const commonTheme = {
  background,
  colors: {
    primary: primaryColors,
    secondary: secondaryColors,
  },
  border,
  effects,
  global,
  sizing,
  spacing,
  typography,
  custom: customCommon,
}
