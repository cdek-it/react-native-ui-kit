import { render } from '@testing-library/react-native'
import { Text } from 'react-native'

import { UnistylesRuntime } from 'react-native-unistyles'

import { ThemeContextProvider } from '../ThemeContext'
import { darkTheme } from '../darkTheme'
import { lightTheme } from '../lightTheme'
import { semanticTokens } from '../tokens'
import darkComponentTokens from '../tokens/components/dark.json'
import lightComponentTokens from '../tokens/components/light.json'
import darkSemanticColorSchemeTokens from '../tokens/semantic/colorScheme/dark.json'
import lightSemanticColorSchemeTokens from '../tokens/semantic/colorScheme/light.json'
import semanticDimensions from '../tokens/semantic/dimensions.json'
import semanticEffects from '../tokens/semantic/effects.json'
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

  test('каждая тема содержит только соответствующую цветовую схему', () => {
    expect(lightTheme.semantic.colorScheme).toBe(lightSemanticColorSchemeTokens)
    expect(darkTheme.semantic.colorScheme).toBe(darkSemanticColorSchemeTokens)
    expect(lightTheme.semantic).not.toHaveProperty('dimension')
    expect(lightTheme.semantic).not.toHaveProperty('effects')
  })

  test('общие semantic-токены не зависят от темы', () => {
    expect(semanticTokens.dimension).toBe(semanticDimensions)
    expect(semanticTokens.effects).toBe(semanticEffects)
  })

  test('каждая тема содержит соответствующие component-токены', () => {
    expect(lightTheme.components).toBe(lightComponentTokens)
    expect(darkTheme.components).toBe(darkComponentTokens)
  })
})
