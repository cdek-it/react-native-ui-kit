import { useUnistyles } from 'react-native-unistyles'

import type { FontsConfig } from '../theme'

export const useFonts = (): FontsConfig => {
  const { theme } = useUnistyles()
  const { primary, secondary } = theme.fonts

  return { primary, secondary }
}
