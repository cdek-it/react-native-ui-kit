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
  semantic: ThemeTokens
  components: ThemeTokens
  /** Семейства шрифтов: не зависят от цветовой схемы, файл один на обе темы. */
  fonts: TokenTree
}

export interface ThemeTokens {
  light: TokenTree
  dark: TokenTree
}

export const isTokenTree = (value: unknown): value is TokenTree =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
