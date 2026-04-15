import type { Rule } from 'eslint'

export type RuleContext = Rule.RuleContext

/**
 * ESLint AST узлы имеют сложную типизацию с дискриминированными типами.
 * Используем more practical подход с type guards и indexed access.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ASTNode = any
