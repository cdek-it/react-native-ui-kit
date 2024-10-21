import { useContext } from 'react'

import { ThemeContext } from '../theme'

export const useChangeTheme = () => {
  return useContext(ThemeContext).changeTheme
}
