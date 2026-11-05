import type { FontTokens } from '../types'

import darkComponentTokens from './components/dark.json'
import lightComponentTokens from './components/light.json'
import generatedFontTokens from './fonts.json'
import dimensions from './semantic/dimensions.json'
import effects from './semantic/effects.json'

export const semanticTokens = { dimension: dimensions, effects } as const

export type SemanticTokens = typeof semanticTokens

export type ComponentTokens = typeof lightComponentTokens

export const componentTokens = {
  light: lightComponentTokens,
  dark: darkComponentTokens,
} as const

export const fontTokens = generatedFontTokens as FontTokens
