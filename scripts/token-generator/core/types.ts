export type TokenPrimitive = string | number | boolean | null
export type TokenValue = TokenPrimitive | TokenTree | TokenValue[]

export interface TokenTree {
  [key: string]: TokenValue
}

export interface BoxEdges {
  top: number
  right: number
  bottom: number
  left: number
}

export interface CompiledTokens {
  fonts: TokenTree
  semantic: SemanticTokens
  components: ThemeTokens
}

export interface SemanticTokens {
  colorScheme: ThemeTokens
  dimension: TokenTree
  effects: TokenTree
}

export interface ThemeTokens {
  light: TokenTree
  dark: TokenTree
}

export const isTokenTree = (value: unknown): value is TokenTree =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
