import { ThemeVariant } from '../theme'
import { UnistylesRuntime } from '../utils'

export const useTheme = (): ThemeVariant => {
  return UnistylesRuntime.themeName === 'dark'
    ? ThemeVariant.Dark
    : ThemeVariant.Light
}
