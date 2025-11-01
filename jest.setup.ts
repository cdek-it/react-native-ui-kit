import 'jest-extended'
import 'react-native-gesture-handler/jestSetup'
import { setUpTests } from 'react-native-reanimated'

setUpTests()

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
