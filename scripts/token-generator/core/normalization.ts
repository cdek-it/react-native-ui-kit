import {
  isTokenTree,
  type BoxEdges,
  type TokenPrimitive,
  type TokenTree,
  type TokenValue,
} from './types'

const REM_BASE = 16
export const BOX_PROPERTIES = ['padding', 'margin', 'borderWidth'] as const

export type BoxProperty = (typeof BOX_PROPERTIES)[number]

export const convertUnit = (value: TokenPrimitive): TokenPrimitive => {
  if (typeof value !== 'string') return value

  const isRem = /^-?\d*\.?\d+rem$/.test(value)

  if (isRem) return Number(value.slice(0, -3)) * REM_BASE

  const isMilliseconds = /^-?\d*\.?\d+ms$/.test(value)

  if (isMilliseconds) return Number(value.slice(0, -2))

  if (value === '0') return 0

  return value.replace(/-?\d*\.?\d+rem\b/g, (token) => {
    const pixels = Number(token.slice(0, -3)) * REM_BASE

    return `${pixels}px`
  })
}

const parseBoxPart = (part: string, tokenPath: string): number => {
  if (!/^-?\d*\.?\d+(?:rem)?$/.test(part)) {
    throw new Error(`Invalid box value "${part}" at "${tokenPath}"`)
  }

  const isRem = part.endsWith('rem')
  const value = Number(isRem ? part.slice(0, -3) : part)
  const normalized = isRem ? value * REM_BASE : value

  if (!Number.isFinite(normalized)) {
    throw new Error(`Non-finite box value "${part}" at "${tokenPath}"`)
  }

  return normalized
}

export const parseBoxShorthand = (
  value: string | number,
  tokenPath = 'box'
): BoxEdges => {
  const parts =
    typeof value === 'number'
      ? [value]
      : value
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map((part) => parseBoxPart(part, tokenPath))

  if (parts.length === 0 || parts.length > 4) {
    throw new Error(`Expected 1-4 box values at "${tokenPath}"`)
  }

  const [top, right = top, bottom = top, left = right] = parts

  if (
    top === undefined ||
    right === undefined ||
    bottom === undefined ||
    left === undefined
  ) {
    throw new Error(`Unable to expand box value at "${tokenPath}"`)
  }

  return { top, right, bottom, left }
}

const edgePropertyName = (
  property: BoxProperty,
  edge: keyof BoxEdges
): string => {
  const capitalizedEdge = `${edge[0].toUpperCase()}${edge.slice(1)}`

  return property === 'borderWidth'
    ? `border${capitalizedEdge}Width`
    : `${property}${capitalizedEdge}`
}

const assignBoxEdges = (
  target: TokenTree,
  source: TokenTree,
  property: BoxProperty,
  edges: BoxEdges,
  tokenPath: string
): void => {
  for (const [edge, edgeValue] of Object.entries(edges) as Array<
    [keyof BoxEdges, number]
  >) {
    const edgeKey = edgePropertyName(property, edge)

    if (edgeKey in source || edgeKey in target) {
      throw new Error(`Duplicate generated token "${tokenPath}.${edgeKey}"`)
    }

    target[edgeKey] = edgeValue
  }
}

export const normalizeTree = (
  node: TokenValue,
  tokenPath = 'root'
): TokenValue => {
  if (Array.isArray(node)) {
    return node.map((item, index) =>
      normalizeTree(item, `${tokenPath}.${index}`)
    )
  }

  if (!isTokenTree(node)) return convertUnit(node)

  const normalized: TokenTree = {}

  for (const [key, value] of Object.entries(node)) {
    const currentPath = `${tokenPath}.${key}`
    const boxProperty = BOX_PROPERTIES.find((property) => property === key)

    if (
      boxProperty &&
      (typeof value === 'string' || typeof value === 'number')
    ) {
      const edges = parseBoxShorthand(value, currentPath)
      const partCount =
        typeof value === 'number'
          ? 1
          : value.trim().split(/\s+/).filter(Boolean).length

      if (partCount === 1) {
        normalized[key] = edges.top
      } else {
        assignBoxEdges(normalized, node, boxProperty, edges, currentPath)
      }
    } else {
      normalized[key] = normalizeTree(value, currentPath)
    }
  }

  return normalized
}
