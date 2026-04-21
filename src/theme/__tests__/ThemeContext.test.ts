import { act, renderHook } from '@testing-library/react-native'

import { useChangeTheme } from '../../hooks/useChangeTheme'
import { UnistylesRuntime } from '../../utils'
import { ThemeVariant } from '../types'

describe('ThemeContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('useChangeTheme переключает тему через UnistylesRuntime', () => {
    const { result } = renderHook(() => useChangeTheme())

    act(() => {
      result.current(ThemeVariant.Dark)
    })

    expect(UnistylesRuntime.setTheme).toHaveBeenCalledWith('dark')
  })
})
