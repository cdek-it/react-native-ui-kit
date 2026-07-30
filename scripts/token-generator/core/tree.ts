import { isTokenTree, type TokenTree, type TokenValue } from './types'

const cloneValue = (value: TokenValue): TokenValue => {
  if (Array.isArray(value)) return value.map(cloneValue)

  if (isTokenTree(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        cloneValue(nestedValue),
      ])
    )
  }

  return value
}

export const mergeTrees = (base: TokenTree, override: TokenTree): TokenTree => {
  const result = cloneValue(base) as TokenTree

  for (const [key, value] of Object.entries(override)) {
    const current = result[key]

    result[key] =
      isTokenTree(current) && isTokenTree(value)
        ? mergeTrees(current, value)
        : cloneValue(value)
  }

  return result
}

export const resolvePath = (
  source: TokenTree,
  tokenPath: string,
  context = 'input tokens'
): TokenValue => {
  let current: TokenValue = source

  for (const segment of tokenPath.split('.')) {
    if (!isTokenTree(current) || !(segment in current)) {
      throw new Error(`Missing "${tokenPath}" in ${context}`)
    }

    current = current[segment]
  }

  return current
}
