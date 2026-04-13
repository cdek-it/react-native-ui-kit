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

const originalStyleSheetCreate = unistyles.StyleSheet.create
const runtime = unistyles.UnistylesRuntime

runtime.themeName = 'light'
runtime.setTheme = jest.fn((themeName: ThemeName) => {
  runtime.themeName = themeName
})

unistyles.useUnistyles = jest.fn(() => ({
  theme: getTheme(runtime.themeName),
  rt: runtime,
}))

unistyles.StyleSheet.create = jest.fn(
  (stylesheet: Parameters<typeof originalStyleSheetCreate>[0]) =>
    typeof stylesheet === 'function'
      ? originalStyleSheetCreate(() =>
          stylesheet(getTheme(runtime.themeName), runtime.miniRuntime)
        )
      : originalStyleSheetCreate(stylesheet)
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
