import { renderHook } from '@testing-library/react-native'

import { ThemeContext, ThemeVariant } from '../../theme'
import { useChangeTheme } from '../useChangeTheme'

describe('useChangeTheme', () => {
  test('returns correct function', () => {
    const mockedChangeTheme = jest.fn()
    const { result } = renderHook(() => useChangeTheme(), {
      wrapper: ({ children }) => (
        <ThemeContext.Provider
          value={{ changeTheme: mockedChangeTheme, theme: ThemeVariant.Light }}
        >
          {children}
        </ThemeContext.Provider>
      ),
    })

    expect(result.current).toStrictEqual(expect.any(Function))

    result.current?.(ThemeVariant.Dark)

    expect(mockedChangeTheme).toHaveBeenCalledWith(ThemeVariant.Dark)
  })
})
