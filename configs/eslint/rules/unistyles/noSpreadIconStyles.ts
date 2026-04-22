import type { ASTNode, RuleContext } from './types'

/**
 * Правило: не спредить styles в Icon компонентах
 * ❌ <Icon {...styles.icon} />
 * ✅ <Icon width={24} height={24} color={color} />
 */
export const noSpreadIconStyles = {
  meta: {
    type: 'suggestion' as const,
    docs: {
      description: 'Передавай явные props для Icon вместо spread',
      category: 'Best Practices',
      recommended: 'warn' as const,
    },
    messages: {
      noSpread:
        'Не спредь styles в Icon. Передавай явные props: width, height, color',
    },
  },
  create(context: RuleContext) {
    return {
      JSXSpreadAttribute(node: ASTNode) {
        // Проверяем, что это styles.something
        const arg = node.argument

        if (
          arg?.type === 'MemberExpression' &&
          arg.object?.name &&
          arg.object.name.includes('styles')
        ) {
          // Проверяем, что мы в Icon компоненте
          const parent = node.parent

          if (parent?.type === 'JSXOpeningElement') {
            const tagName = parent.name?.name || ''

            if (tagName.includes('Icon')) {
              context.report({ node, messageId: 'noSpread' })
            }
          }
        }
      },
    }
  },
}
