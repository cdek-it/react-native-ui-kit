/* eslint-disable @typescript-eslint/no-deprecated -- Проверяем deprecated API на обратную совместимость. */
import { renderHook } from '@testing-library/react-native'
import { UnistylesRuntime } from 'react-native-unistyles'

import { ThemeVariant } from '../../theme'
import { useTheme } from '../useTheme'

const setThemeName = (themeName: 'light' | 'dark') => {
  Object.assign(UnistylesRuntime, { themeName })
}

describe('useTheme', () => {
  afterEach(() => {
    setThemeName('light')
  })

  test('возвращает ThemeVariant.Light, когда активна светлая тема', () => {
    setThemeName('light')

    const { result } = renderHook(() => useTheme())

    expect(result.current).toBe(ThemeVariant.Light)
  })

  test('возвращает ThemeVariant.Dark, когда активна тёмная тема', () => {
    setThemeName('dark')

    const { result } = renderHook(() => useTheme())

    expect(result.current).toBe(ThemeVariant.Dark)
  })
})
