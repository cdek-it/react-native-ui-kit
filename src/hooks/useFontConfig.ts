import { useContext } from 'react'

import { ThemeContext } from '../theme'

export const useFontConfig = () => {
  return useContext(ThemeContext).fontConfig
}
