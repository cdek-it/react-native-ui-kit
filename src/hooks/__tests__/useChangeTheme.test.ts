/* eslint-disable @typescript-eslint/no-deprecated -- Проверяем deprecated API на обратную совместимость. */
import { act, renderHook } from '@testing-library/react-native'

import { ThemeVariant } from '../../theme'
import { UnistylesRuntime } from '../../utils'

import { useChangeTheme } from '../useChangeTheme'

describe('useChangeTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('вызывает UnistylesRuntime.setTheme с "light" для ThemeVariant.Light', () => {
    const { result } = renderHook(() => useChangeTheme())

    act(() => {
      result.current(ThemeVariant.Light)
    })

    expect(UnistylesRuntime.setTheme).toHaveBeenCalledWith('light')
  })

  test('вызывает UnistylesRuntime.setTheme с "dark" для ThemeVariant.Dark', () => {
    const { result } = renderHook(() => useChangeTheme())

    act(() => {
      result.current(ThemeVariant.Dark)
    })

    expect(UnistylesRuntime.setTheme).toHaveBeenCalledWith('dark')
  })

  test('возвращает стабильную ссылку на callback', () => {
    const { result, rerender } = renderHook(() => useChangeTheme())
    const first = result.current

    rerender({})

    expect(result.current).toBe(first)
  })
})
