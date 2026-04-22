import type { ASTNode, RuleContext } from './types'

/**
 * Правило: не распаковывать стили из unistyles
 * ❌ { ...styles.button }
 * ❌ const btn = { ...styles.button, marginTop: 10 }
 * ✅ [styles.button, customStyle]
 */
export const noSpreadUnistyles = {
  meta: {
    type: 'problem' as const,
    docs: {
      description:
        'Запретить spread операции на стилях из StyleSheet.create() — теряется unistyles metadata',
      category: 'Best Practices',
      recommended: 'error' as const,
    },
    messages: {
      noSpread:
        'Не распаковывай стили через spread ({...styles}). Это теряет unistyles metadata. Используй массив: [styles.button, customStyle]',
    },
  },
  create(context: RuleContext) {
    return {
      SpreadElement(node: ASTNode) {
        // Проверяем: { ...styles.foo }
        const arg = node.argument

        if (
          arg?.type === 'MemberExpression' &&
          arg.object?.type === 'Identifier' &&
          arg.object.name?.includes('styles')
        ) {
          context.report({ node, messageId: 'noSpread' })
        }
      },

      CallExpression(node: ASTNode) {
        // Проверяем Object.assign({}, styles.foo)
        if (
          node.callee?.object?.name === 'Object' &&
          node.callee?.property?.name === 'assign'
        ) {
          for (const arg of node.arguments || []) {
            if (
              arg?.type === 'MemberExpression' &&
              arg.object?.name?.includes('styles')
            ) {
              context.report({ node, messageId: 'noSpread' })

              return
            }
          }
        }
      },
    }
  },
}
