import { renderHook } from '@testing-library/react-native'
import React from 'react'

import { ThemeContextProvider, ThemeVariant } from '../../theme'
import { useTheme } from '../useTheme'

describe('useTheme', () => {
  test('returns correct function', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeContextProvider>{children}</ThemeContextProvider>,
    })

    expect(Object.values(ThemeVariant)).toContain(result.current)
  })
})
