import type { InputSize } from './assets/InputSize'
import type lightTheme from './assets/themeLight.json'
import type { commonTheme } from './commonTheme'

export type ThemeType = typeof commonTheme & {
  theme: typeof lightTheme & { InputSize: typeof InputSize }
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
