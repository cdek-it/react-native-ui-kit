import type { FontsConfig } from '../theme'
import { useUnistyles } from '../utils'

export const useFonts = (): FontsConfig => {
  const { theme } = useUnistyles()

  return theme.fonts
}
