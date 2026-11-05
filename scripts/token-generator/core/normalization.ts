import {
  isTokenTree,
  type BoxEdges,
  type TokenPrimitive,
  type TokenTree,
  type TokenValue,
} from './types'

const REM_BASE = 16
const NUMBER_SOURCE = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)'
const NUMBER_PATTERN = /^-?\d*\.?\d+$/
const PIXEL_PATTERN = /^-?\d*\.?\d+px$/
const SHADOW_LENGTH_PATTERN = /^(?:0|-?\d*\.?\d+(?:rem|px))$/
const CUBIC_BEZIER_PATTERN = new RegExp(
  `^cubic-bezier\\(\\s*(${NUMBER_SOURCE})\\s*,\\s*(${NUMBER_SOURCE})\\s*,\\s*(${NUMBER_SOURCE})\\s*,\\s*(${NUMBER_SOURCE})\\s*\\)$`
)
export const BOX_PROPERTIES = ['padding', 'margin', 'borderWidth'] as const

export type BoxProperty = (typeof BOX_PROPERTIES)[number]

export const isEasingTokenPath = (tokenPath: string): boolean =>
  /\.effects\.transition\.easing\.[^.]+$/.test(tokenPath)

export const normalizeEasing = (
  value: TokenValue,
  tokenPath = 'semantic.effects.transition.easing'
): TokenTree => {
  if (typeof value !== 'string') {
    throw new Error(`Expected easing string at "${tokenPath}"`)
  }

  const easing = value.trim()

  if (easing === 'linear') return { x1: 0, y1: 0, x2: 1, y2: 1 }

  const match = CUBIC_BEZIER_PATTERN.exec(easing)

  if (!match) {
    throw new Error(`Unsupported easing "${value}" at "${tokenPath}"`)
  }

  const [, x1Source, y1Source, x2Source, y2Source] = match
  const coordinates = [x1Source, y1Source, x2Source, y2Source].map(Number)
  const [x1, y1, x2, y2] = coordinates

  if (
    coordinates.some((coordinate) => !Number.isFinite(coordinate)) ||
    x1 === undefined ||
    y1 === undefined ||
    x2 === undefined ||
    y2 === undefined
  ) {
    throw new Error(`Invalid easing "${value}" at "${tokenPath}"`)
  }

  if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) {
    throw new Error(
      `Easing x coordinates must be between 0 and 1 at "${tokenPath}"`
    )
  }

  return { x1, y1, x2, y2 }
}

export const isBoxShadowValue = (value: string): boolean => {
  const parts = value
    .trim()
    .split(/\s+(?![^(]*\))/)
    .filter(Boolean)
  const insetIndex = parts.indexOf('inset')

  if (insetIndex > 0 && insetIndex < parts.length - 1) return false

  const shadowParts = parts.filter((_, index) => index !== insetIndex)
  const colorIndexes = shadowParts
    .map((part, index) => (SHADOW_LENGTH_PATTERN.test(part) ? -1 : index))
    .filter((index) => index !== -1)

  if (colorIndexes.length !== 1) return false

  const [colorIndex] = colorIndexes

  if (colorIndex !== 0 && colorIndex !== shadowParts.length - 1) return false

  const lengths = shadowParts.filter((_, index) => index !== colorIndex)

  return (
    lengths.length >= 2 &&
    lengths.length <= 4 &&
    lengths.every((part) => SHADOW_LENGTH_PATTERN.test(part))
  )
}

export const convertUnit = (
  value: TokenPrimitive,
  tokenPath = 'root'
): TokenPrimitive => {
  if (typeof value !== 'string') return value

  const isRem = /^-?\d*\.?\d+rem$/.test(value)

  if (isRem) return Number(value.slice(0, -3)) * REM_BASE

  const isMilliseconds = /^-?\d*\.?\d+ms$/.test(value)

  if (isMilliseconds) return Number(value.slice(0, -2))

  if (PIXEL_PATTERN.test(value)) return Number(value.slice(0, -2))

  if (NUMBER_PATTERN.test(value)) return Number(value)

  const converted = value.replace(/-?\d*\.?\d+rem\b/g, (token) => {
    const pixels = Number(token.slice(0, -3)) * REM_BASE

    return `${pixels}px`
  })

  if (converted !== value && !isBoxShadowValue(converted)) {
    throw new Error(
      `Unsupported composite unit value "${value}" at "${tokenPath}"`
    )
  }

  return converted
}

const parseBoxPart = (part: string, tokenPath: string): number => {
  if (!/^-?\d*\.?\d+(?:rem|px)?$/.test(part)) {
    throw new Error(`Invalid box value "${part}" at "${tokenPath}"`)
  }

  const unit = part.endsWith('rem') ? 'rem' : part.endsWith('px') ? 'px' : ''
  const value = Number(unit ? part.slice(0, -unit.length) : part)
  const isRem = unit === 'rem'
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

const normalizeBorderRadius = (
  value: string | number,
  tokenPath: string
): number | TokenTree => {
  const corners = parseBoxShorthand(value, tokenPath)
  const values = Object.values(corners)

  if (values.every((corner) => corner === corners.top)) {
    return corners.top
  }

  return {
    left: corners.left,
    top: corners.top,
    right: corners.right,
    bottom: corners.bottom,
  }
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
  if (isEasingTokenPath(tokenPath)) {
    return normalizeEasing(node, tokenPath)
  }

  if (Array.isArray(node)) {
    return node.map((item, index) =>
      normalizeTree(item, `${tokenPath}.${index}`)
    )
  }

  if (!isTokenTree(node)) return convertUnit(node, tokenPath)

  const normalized: TokenTree = {}

  for (const [key, value] of Object.entries(node)) {
    const currentPath = `${tokenPath}.${key}`
    const boxProperty = BOX_PROPERTIES.find((property) => property === key)

    if (
      key === 'borderRadius' &&
      (typeof value === 'string' || typeof value === 'number')
    ) {
      normalized[key] = normalizeBorderRadius(value, currentPath)
    } else if (
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
