import { useUnistyles } from 'react-native-unistyles'

import type { ThemeType } from '../theme/types'

export const useFonts = (): ThemeType['fonts'] => {
  const { theme } = useUnistyles()

  return theme.fonts
}
