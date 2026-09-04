import {
  BOX_PROPERTIES,
  isEasingTokenPath,
  isBoxShadowValue,
  type BoxProperty,
} from './normalization'
import { isTokenTree, type TokenTree, type TokenValue } from './types'

const REFERENCE_PATTERN = /\{[^}]+\}/
const UNCONVERTED_UNIT_PATTERN = /-?\d*\.?\d+(?:rem|ms)\b/
const PIXEL_PATTERN = /-?\d*\.?\d+px\b/
const NUMERIC_STRING_PATTERN = /^-?\d*\.?\d+$/
const CUBIC_BEZIER_PATTERN = /cubic-bezier\s*\(/

export const assertValidOutput = (
  node: TokenValue,
  tokenPath: string
): void => {
  if (Array.isArray(node)) {
    node.forEach((item, index) =>
      assertValidOutput(item, `${tokenPath}.${index}`)
    )

    return
  }

  if (isTokenTree(node)) {
    for (const [key, value] of Object.entries(node)) {
      if (
        (BOX_PROPERTIES.includes(key as BoxProperty) ||
          key === 'borderRadius') &&
        typeof value === 'string'
      ) {
        throw new Error(`Unconverted box shorthand at "${tokenPath}.${key}"`)
      }

      assertValidOutput(value, `${tokenPath}.${key}`)
    }

    return
  }

  if (typeof node === 'number' && !Number.isFinite(node)) {
    throw new Error(`Non-finite number at "${tokenPath}"`)
  }

  if (typeof node === 'string') {
    const hasUnconvertedValue =
      REFERENCE_PATTERN.test(node) ||
      UNCONVERTED_UNIT_PATTERN.test(node) ||
      (PIXEL_PATTERN.test(node) && !isBoxShadowValue(node)) ||
      NUMERIC_STRING_PATTERN.test(node) ||
      CUBIC_BEZIER_PATTERN.test(node) ||
      (node === 'linear' && isEasingTokenPath(tokenPath))

    if (hasUnconvertedValue) {
      throw new Error(`Unconverted token "${node}" at "${tokenPath}"`)
    }
  }
}

const collectShape = (
  node: TokenValue,
  tokenPath = 'root',
  shape: string[] = []
): string[] => {
  if (Array.isArray(node)) {
    shape.push(`${tokenPath}:array`)
    node.forEach((item, index) =>
      collectShape(item, `${tokenPath}.${index}`, shape)
    )

    return shape
  }

  if (isTokenTree(node)) {
    shape.push(`${tokenPath}:object`)
    Object.entries(node).forEach(([key, value]) =>
      collectShape(value, `${tokenPath}.${key}`, shape)
    )

    return shape
  }

  shape.push(`${tokenPath}:${node === null ? 'null' : typeof node}`)

  return shape
}

export const assertSameShape = (light: TokenTree, dark: TokenTree): void => {
  const lightShape = collectShape(light).sort()
  const darkShape = collectShape(dark).sort()

  if (JSON.stringify(lightShape) !== JSON.stringify(darkShape)) {
    throw new Error('Light and dark runtime tokens have different shapes')
  }
}
