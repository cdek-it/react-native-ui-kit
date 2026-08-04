import { render } from '@testing-library/react-native'
import { Text } from 'react-native'

import { UnistylesRuntime } from 'react-native-unistyles'

import { ThemeContextProvider } from '../ThemeContext'
import { darkTheme } from '../darkTheme'
import { lightTheme } from '../lightTheme'
import { componentTokens, fontTokens, semanticTokens } from '../tokens'
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
    const theme = UnistylesRuntime.getTheme('light')

    expect(updater(theme)).toStrictEqual({
      ...theme,
      fonts: {
        ...theme.fonts,
        ...fonts,
        fontFamily: { base: fonts.secondary, heading: fonts.primary },
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

  test('component-токены не входят в публичные темы', () => {
    expect(lightTheme).not.toHaveProperty('components')
    expect(darkTheme).not.toHaveProperty('components')
  })

  test('внутренняя карта component-токенов содержит обе темы', () => {
    expect(componentTokens.light).toBe(lightComponentTokens)
    expect(componentTokens.dark).toBe(darkComponentTokens)
  })

  test('внутренняя тема Unistyles содержит сгенерированные токены', () => {
    const internalLightTheme = UnistylesRuntime.getTheme('light')
    const internalDarkTheme = UnistylesRuntime.getTheme('dark')

    expect(internalLightTheme).toMatchObject({
      components: lightComponentTokens,
      fonts: fontTokens,
      semantic: {
        colorScheme: lightSemanticColorSchemeTokens,
        dimension: semanticDimensions,
        effects: semanticEffects,
      },
    })

    expect(internalDarkTheme).toMatchObject({
      components: darkComponentTokens,
      fonts: fontTokens,
      semantic: {
        colorScheme: darkSemanticColorSchemeTokens,
        dimension: semanticDimensions,
        effects: semanticEffects,
      },
    })
    expect(internalLightTheme.fonts).toStrictEqual(internalDarkTheme.fonts)
  })
})
