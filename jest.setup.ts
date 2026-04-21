import 'jest-extended'
import { createElement } from 'react'
import 'react-native-gesture-handler/jestSetup'
import { setUpTests } from 'react-native-reanimated'
import 'react-native-unistyles/mocks'

setUpTests()

type ThemeName = 'light' | 'dark'

jest.mock('react-native-worklets', () =>
  require('react-native-worklets/src/mock')
)

interface MockedUnistylesModule {
  StyleSheet: { create: (...args: unknown[]) => unknown }
  UnistylesRuntime: {
    miniRuntime: unknown
    setTheme: jest.Mock<void, [ThemeName]>
    updateTheme: jest.Mock<void, [ThemeName, (theme: unknown) => unknown]>
    themeName: ThemeName | undefined
  }
  useUnistyles: jest.Mock
  withUnistyles: jest.Mock
}

const unistyles = jest.requireMock(
  'react-native-unistyles'
) as MockedUnistylesModule

// Late-bound holder: темы подгружаются ПОСЛЕ установки моков, чтобы к моменту
// загрузки src/theme (и как следствие — src/utils/SvgUniversal с
// `withUnistyles(...)` на top-level) в модуле уже стояли наши моки, а не
// исходные identity-заглушки.
const themeRef: {
  current: { darkTheme: unknown; lightTheme: unknown } | null
} = { current: null }

const getTheme = (themeName: ThemeName | undefined) =>
  themeName === 'dark'
    ? themeRef.current?.darkTheme
    : themeRef.current?.lightTheme

const runtime = unistyles.UnistylesRuntime

runtime.themeName = 'light'
runtime.setTheme = jest.fn((themeName: ThemeName) => {
  runtime.themeName = themeName
})
runtime.updateTheme = jest.fn()

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

unistyles.withUnistyles = jest.fn(
  <P extends Record<string, unknown>>(
    Component: React.ComponentType<P>
  ): React.ComponentType<
    P & { uniProps?: (theme: unknown, rt: unknown) => Partial<P> }
  > => {
    const Wrapped = (
      props: P & {
        readonly uniProps?: (theme: unknown, rt: unknown) => Partial<P>
      }
    ) => {
      const { uniProps, ...rest } = props
      const themeProps = uniProps
        ? uniProps(getTheme(runtime.themeName), runtime)
        : {}

      return createElement(Component, { ...(rest as P), ...themeProps })
    }

    return Wrapped
  }
)

themeRef.current = require('./src/theme') as {
  darkTheme: unknown
  lightTheme: unknown
}

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
