import { resolvePath } from './tree'
import { isTokenTree, type TokenTree, type TokenValue } from './types'

const EXACT_REFERENCE_PATTERN = /^\{[^{}]+\}$/
const REFERENCE_PATTERN = /\{[^{}]+\}/g

const stringifyReference = (
  value: TokenValue,
  reference: string,
  tokenPath: string
): string => {
  if (value === null || Array.isArray(value) || isTokenTree(value)) {
    throw new Error(
      `Reference "${reference}" at "${tokenPath}" cannot be embedded in a string`
    )
  }

  return String(value)
}

export const resolveReferences = (
  node: TokenValue,
  referenceRoot: TokenTree,
  tokenPath = 'root'
): TokenValue => {
  const cache = new Map<string, TokenValue>()

  const resolveReference = (
    reference: string,
    sourcePath: string,
    stack: string[]
  ): TokenValue => {
    if (stack.includes(reference)) {
      throw new Error(
        `Circular token reference at "${sourcePath}": ${[
          ...stack,
          reference,
        ].join(' -> ')}`
      )
    }

    const cached = cache.get(reference)

    if (cached !== undefined) return cached

    const referencedValue = resolvePath(
      referenceRoot,
      reference,
      `references for "${sourcePath}"`
    )
    const resolved = resolveNode(referencedValue, reference, [
      ...stack,
      reference,
    ])

    cache.set(reference, resolved)

    return resolved
  }

  const resolveNode = (
    value: TokenValue,
    currentPath: string,
    stack: string[]
  ): TokenValue => {
    if (Array.isArray(value)) {
      return value.map((item, index) =>
        resolveNode(item, `${currentPath}.${index}`, stack)
      )
    }

    if (isTokenTree(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, nestedValue]) => [
          key,
          resolveNode(nestedValue, `${currentPath}.${key}`, stack),
        ])
      )
    }

    if (typeof value !== 'string') return value

    if (EXACT_REFERENCE_PATTERN.test(value)) {
      return resolveReference(value.slice(1, -1), currentPath, stack)
    }

    return value.replace(REFERENCE_PATTERN, (token) => {
      const reference = token.slice(1, -1)

      return stringifyReference(
        resolveReference(reference, currentPath, stack),
        reference,
        currentPath
      )
    })
  }

  return resolveNode(node, tokenPath, [])
}
