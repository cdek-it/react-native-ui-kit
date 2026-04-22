import { UnistylesRuntime } from 'react-native-unistyles'

import { ThemeVariant } from '../theme'

const THEME_VARIANT_MAP: Record<'light' | 'dark', ThemeVariant> = {
  light: ThemeVariant.Light,
  dark: ThemeVariant.Dark,
}

export const useTheme = (): ThemeVariant =>
  THEME_VARIANT_MAP[UnistylesRuntime.themeName ?? 'light']
