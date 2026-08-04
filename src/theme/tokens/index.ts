import dimensions from './semantic/dimensions.json'
import effects from './semantic/effects.json'

export const semanticTokens = { dimension: dimensions, effects } as const

export type SemanticTokens = typeof semanticTokens
