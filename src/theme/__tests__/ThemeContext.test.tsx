import { render } from '@testing-library/react-native'
import { Text } from 'react-native'

import { UnistylesRuntime } from '../../utils'
import { ThemeContextProvider } from '../ThemeContext'
import { lightTheme } from '../lightTheme'
import { ThemeVariant } from '../types'

describe('ThemeContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('при mount применяет initialTheme через UnistylesRuntime.setTheme', () => {
    render(
      <ThemeContextProvider initialTheme={ThemeVariant.Dark}>
        <Text>child</Text>
      </ThemeContextProvider>
    )

    expect(UnistylesRuntime.setTheme).toHaveBeenCalledWith('dark')
  })

  test('по умолчанию применяет светлую тему', () => {
    render(
      <ThemeContextProvider>
        <Text>child</Text>
      </ThemeContextProvider>
    )

    expect(UnistylesRuntime.setTheme).toHaveBeenCalledWith('light')
  })

  test('при передаче fonts обновляет обе темы', () => {
    const fonts = { primary: 'Roboto', secondary: 'Inter' }

    render(
      <ThemeContextProvider fonts={fonts}>
        <Text>child</Text>
      </ThemeContextProvider>
    )

    expect(UnistylesRuntime.updateTheme).toHaveBeenCalledWith(
      'light',
      expect.any(Function)
    )
    expect(UnistylesRuntime.updateTheme).toHaveBeenCalledWith(
      'dark',
      expect.any(Function)
    )

    const [, updater] = jest.mocked(UnistylesRuntime.updateTheme).mock.calls[0]

    expect(
      updater({ ...lightTheme, fonts: { primary: 'old', secondary: 'old' } })
    ).toStrictEqual({ ...lightTheme, fonts })
  })

  test('без fonts не вызывает updateTheme', () => {
    render(
      <ThemeContextProvider>
        <Text>child</Text>
      </ThemeContextProvider>
    )

    expect(UnistylesRuntime.updateTheme).not.toHaveBeenCalled()
  })
})
