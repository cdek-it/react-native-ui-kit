type PropertyCombinations<T> = { [K in keyof T]: Array<T[K]> }

declare let generatePropsCombinations: <T>(
  properties: PropertyCombinations<T>
) => T[]

declare module '@react-native/normalize-colors' {
  const normalizeColors: (color: string | number) => number | null

  export default normalizeColors
}
