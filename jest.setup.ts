import 'react-native-gesture-handler/jestSetup'
import '@testing-library/react-native/extend-expect'

generatePropsCombinations = <T>(properties: PropertyCombinations<T>): T[] => {
  const keys = Object.keys(properties) as Array<keyof T>

  function combine(index: number, current: Partial<T>): T[] {
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
