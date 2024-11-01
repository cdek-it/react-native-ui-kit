import type background from './assets/background.json'
import type border from './assets/border.json'
import type effects from './assets/effects.json'
import type global from './assets/global.json'
import type primaryColors from './assets/primaryColors.json'
import type secondaryColors from './assets/secondaryColors.json'
import type sizing from './assets/sizing.json'
import type spacing from './assets/spacing.json'
import type lightTheme from './assets/themeLight.json'
import type typography from './assets/typography.json'

export interface ThemeType {
  background: typeof background
  colors: {
    primary: typeof primaryColors
    secondary: typeof secondaryColors
  }
  border: typeof border
  effects: typeof effects
  global: typeof global
  sizing: typeof sizing
  spacing: typeof spacing
  theme: typeof lightTheme
  typography: typeof typography
}

export enum ThemeVariant {
  Light = 'Light',
  Dark = 'Dark',
}
