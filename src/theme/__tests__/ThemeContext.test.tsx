import { render } from '@testing-library/react-native'
import { Text } from 'react-native'

import { UnistylesRuntime } from 'react-native-unistyles'

import { ThemeContextProvider } from '../ThemeContext'
import { darkTheme, lightTheme } from '../themes'
import { componentTokens, fontTokens, semanticTokens } from '../tokens'
import darkSemanticColorSchemeTokens from '../tokens/semantic/colorScheme/dark.json'
import lightSemanticColorSchemeTokens from '../tokens/semantic/colorScheme/light.json'
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

  test('при legacy-формате fonts обновляет обе темы', () => {
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
    const theme = lightTheme

    expect(updater(theme)).toStrictEqual({
      ...theme,
      fonts: {
        ...theme.fonts,
        fontFamily: {
          ...theme.fonts.fontFamily,
          heading: fonts.primary,
          base: fonts.secondary,
        },
        ...fonts,
      },
    })
  })

  test('при актуальном формате fonts обновляет обе темы', () => {
    const fonts = { heading: 'Roboto', base: 'Inter' }

    render(
      <ThemeContextProvider fonts={fonts}>
        <Text>child</Text>
      </ThemeContextProvider>
    )

    const [, updater] = jest.mocked(UnistylesRuntime.updateTheme).mock.calls[0]
    const theme = lightTheme

    expect(updater(theme)).toStrictEqual({
      ...theme,
      fonts: {
        ...theme.fonts,
        fontFamily: { ...theme.fonts.fontFamily, ...fonts },
        primary: fonts.heading,
        secondary: fonts.base,
      },
    })
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
    expect(lightTheme.semantic.colorScheme).toBe(lightSemanticColorSchemeTokens)
    expect(darkTheme.semantic.colorScheme).toBe(darkSemanticColorSchemeTokens)
    expect(lightTheme.semantic.dimension).toBe(semanticTokens.dimension)
    expect(lightTheme.semantic.effects).toBe(semanticTokens.effects)
  })

  test('общие semantic-токены не зависят от темы', () => {
    expect(lightTheme.semantic.dimension).toBe(darkTheme.semantic.dimension)
    expect(lightTheme.semantic.effects).toBe(darkTheme.semantic.effects)
  })

  test('каждая тема содержит соответствующие component-токены', () => {
    expect(lightTheme.components).toBe(componentTokens.light)
    expect(darkTheme.components).toBe(componentTokens.dark)
  })

  test('каждая тема содержит общие шрифтовые токены', () => {
    expect(lightTheme.fonts.fontSize).toBe(fontTokens.fontSize)
    expect(darkTheme.fonts.fontSize).toBe(fontTokens.fontSize)
  })

  test('публичные темы сохраняют legacy-алиасы шрифтов', () => {
    expect(lightTheme.fonts).toStrictEqual(
      expect.objectContaining({
        primary: fontTokens.fontFamily.heading,
        secondary: fontTokens.fontFamily.base,
      })
    )
  })

  test('публичные темы сохраняют legacy-токены', () => {
    const legacyKeys = [
      'background',
      'border',
      'colors',
      'custom',
      'effects',
      'global',
      'shadow',
      'sizing',
      'spacing',
      'theme',
      'typography',
    ]

    expect(Object.keys(lightTheme)).toStrictEqual(
      expect.arrayContaining(legacyKeys)
    )
    expect(Object.keys(darkTheme)).toStrictEqual(
      expect.arrayContaining(legacyKeys)
    )
  })
})
