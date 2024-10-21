import { useContext } from 'react'

import { ThemeContext } from '../theme'

export const useTheme = () => {
  return useContext(ThemeContext).theme
}
