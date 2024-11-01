type PropertyCombinations<T> = {
  [K in keyof T]: Array<T[K]>
}

declare let generatePropsCombinations: <T>(properties: PropertyCombinations<T>) => T[]
