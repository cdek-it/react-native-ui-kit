import 'jest-extended'
import 'react-native-gesture-handler/jestSetup'
import { setUpTests } from 'react-native-reanimated'
import 'react-native-unistyles/mocks'

setUpTests()

type ThemeName = 'light' | 'dark'

interface MockedUnistylesModule {
  StyleSheet: { create: (...args: unknown[]) => unknown }
  UnistylesRuntime: {
    miniRuntime: unknown
    setTheme: jest.Mock<void, [ThemeName]>
    themeName: ThemeName | undefined
  }
  useUnistyles: jest.Mock
  withUnistyles: jest.Mock
}

const { darkTheme, lightTheme } = require('./src/theme')

const unistyles = jest.requireMock(
  'react-native-unistyles'
) as MockedUnistylesModule

const getTheme = (themeName: ThemeName | undefined) =>
  themeName === 'dark' ? darkTheme : lightTheme

const runtime = unistyles.UnistylesRuntime

runtime.themeName = 'light'
runtime.setTheme = jest.fn((themeName: ThemeName) => {
  runtime.themeName = themeName
})

unistyles.useUnistyles = jest.fn(() => ({
  theme: getTheme(runtime.themeName),
  rt: runtime,
}))

const normalizeVariantValue = (value: unknown) => {
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  return value
}

const resolveStyle = (
  style: Record<string, unknown>,
  activeVariants: Record<string, unknown>
) => {
  const { variants, compoundVariants, ...baseStyle } = style as {
    variants?: Record<string, Record<string, Record<string, unknown>>>
    compoundVariants?: Array<Record<string, unknown>>
  }

  const resolvedStyle: Record<string, unknown> = { ...baseStyle }

  if (variants) {
    for (const [variantName, variantMap] of Object.entries(variants)) {
      const activeValue = normalizeVariantValue(activeVariants[variantName])

      if (
        activeValue !== undefined &&
        variantMap[activeValue as keyof typeof variantMap]
      ) {
        Object.assign(
          resolvedStyle,
          variantMap[activeValue as keyof typeof variantMap]
        )
      }
    }
  }

  if (compoundVariants) {
    for (const compoundVariant of compoundVariants) {
      const { styles, ...conditions } = compoundVariant
      const matches = Object.entries(conditions).every(
        ([variantName, expectedValue]) =>
          normalizeVariantValue(activeVariants[variantName]) ===
          normalizeVariantValue(expectedValue)
      )

      if (matches && styles && typeof styles === 'object') {
        Object.assign(resolvedStyle, styles)
      }
    }
  }

  return resolvedStyle
}

unistyles.StyleSheet.create = jest.fn(
  (stylesheet: ((theme: ReturnType<typeof getTheme>) => unknown) | unknown) => {
    const styleDefinitions =
      typeof stylesheet === 'function'
        ? stylesheet(getTheme(runtime.themeName))
        : stylesheet

    const activeVariants: Record<string, unknown> = {}
    const resolvedStyles: Record<string, unknown> = {
      useVariants: (variants: Record<string, unknown>) => {
        Object.keys(activeVariants).forEach((key) => {
          activeVariants[key] = undefined
        })

        Object.assign(activeVariants, variants)
      },
    }

    for (const [styleName, styleValue] of Object.entries(
      styleDefinitions as Record<string, unknown>
    )) {
      Object.defineProperty(resolvedStyles, styleName, {
        enumerable: true,
        get() {
          if (
            styleValue &&
            typeof styleValue === 'object' &&
            !Array.isArray(styleValue)
          ) {
            return resolveStyle(
              styleValue as Record<string, unknown>,
              activeVariants
            )
          }

          return styleValue
        },
      })
    }

    return resolvedStyles
  }
)

unistyles.withUnistyles = jest.fn(<T>(Component: T) => Component)

generatePropsCombinations = <T>(properties: PropertyCombinations<T>): T[] => {
  const keys = Object.keys(properties) as Array<keyof T>

  const combine = (index: number, current: Partial<T>): T[] => {
    if (index === keys.length) {
      return [current as T]
    }

    const key = keys[index]
    const values = properties[key]
    const combinations: T[] = []

    for (const value of values) {
      combinations.push(...combine(index + 1, { ...current, [key]: value }))
    }

    return combinations
  }

  return combine(0, {})
}
