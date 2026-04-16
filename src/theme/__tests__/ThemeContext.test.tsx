import { act, renderHook } from '@testing-library/react-native'

import { useChangeTheme } from '../../hooks/useChangeTheme'
import { StyleSheet, UnistylesRuntime } from '../../utils'
import { ThemeContextProvider } from '../ThemeContext'
import { darkTheme } from '../darkTheme'
import { lightTheme } from '../lightTheme'
import { ThemeVariant, type FontsConfig } from '../types'

describe('ThemeContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('конфигурирует unistyles с кастомными шрифтами', () => {
    const configureSpy = jest.spyOn(StyleSheet, 'configure')
    const fonts: FontsConfig = {
      primary: 'Custom Primary',
      secondary: 'Custom Secondary',
    }

    renderHook(() => null, {
      wrapper: ({ children }) => (
        <ThemeContextProvider fonts={fonts}>{children}</ThemeContextProvider>
      ),
    })

    expect(configureSpy).toHaveBeenLastCalledWith({
      settings: { initialTheme: 'light' },
      themes: {
        light: { ...lightTheme, fonts },
        dark: { ...darkTheme, fonts },
      },
    })
  })

  test('useChangeTheme переключает тему через ThemeContextProvider', () => {
    const configureSpy = jest.spyOn(StyleSheet, 'configure')
    const { result } = renderHook(() => useChangeTheme(), {
      wrapper: ({ children }) => (
        <ThemeContextProvider>{children}</ThemeContextProvider>
      ),
    })

    act(() => {
      result.current(ThemeVariant.Dark)
    })

    expect(UnistylesRuntime.setTheme).toHaveBeenCalledWith('dark')
    expect(configureSpy).toHaveBeenLastCalledWith({
      settings: { initialTheme: 'dark' },
      themes: { light: lightTheme, dark: darkTheme },
    })
  })
})
