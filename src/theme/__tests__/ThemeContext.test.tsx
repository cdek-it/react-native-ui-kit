import { render } from '@testing-library/react-native'
import { Text } from 'react-native'

import { UnistylesRuntime } from 'react-native-unistyles'

import { ThemeContextProvider } from '../ThemeContext'
import { darkTheme } from '../darkTheme'
import { lightTheme } from '../lightTheme'
import darkComponentTokens from '../tokens/components/dark.json'
import lightComponentTokens from '../tokens/components/light.json'
import fontFamilyTokens from '../tokens/fonts.json'
import darkSemanticTokens from '../tokens/semantic/dark.json'
import lightSemanticTokens from '../tokens/semantic/light.json'
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

  test('каждая тема содержит соответствующие semantic-токены', () => {
    expect(lightTheme.semantic).toBe(lightSemanticTokens)
    expect(darkTheme.semantic).toBe(darkSemanticTokens)
  })

  test('каждая тема содержит соответствующие component-токены', () => {
    expect(lightTheme.components).toBe(lightComponentTokens)
    expect(darkTheme.components).toBe(darkComponentTokens)
  })

  test('шрифты берутся из токенов: primary — heading, secondary — base', () => {
    const expected = {
      primary: fontFamilyTokens.heading,
      secondary: fontFamilyTokens.base,
    }

    expect(lightTheme.fonts).toStrictEqual(expected)
    expect(darkTheme.fonts).toStrictEqual(expected)
    expect(lightTheme.fonts.primary).toBe('TT Fellows')
    expect(lightTheme.fonts.secondary).toBe('Noto Sans')
  })
})
