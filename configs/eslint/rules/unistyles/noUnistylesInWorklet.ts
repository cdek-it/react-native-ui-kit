import type { ASTNode, RuleContext } from './types'

/**
 * Правило: не захватывать styles в worklet closures
 * ❌ useAnimatedStyle(() => ({ color: styles.text.color }))
 */
export const noUnistylesInWorklet = {
  meta: {
    type: 'problem' as const,
    docs: {
      description: 'Запретить захват styles переменных в worklet closures',
      category: 'Best Practices',
      recommended: 'error' as const,
    },
    messages: {
      noCapture:
        'Не захватывай styles переменную в worklet. Вытащи примитив перед: const color = styles.text.color',
    },
  },
  create(context: RuleContext) {
    const workletNames = new Set([
      'useAnimatedStyle',
      'useAnimatedReaction',
      'runOnJS',
      'runOnUIThread',
      'withTiming',
      'withSpring',
      'withDecay',
      'withDelay',
      'withSequence',
      'withRepeat',
    ])

    const skipKeys = new Set(['parent', 'loc', 'range', 'start', 'end'])

    const hasStylesReference = (node: ASTNode): boolean => {
      if (!node) return false

      if (node.type === 'Identifier' && node.name && node.name === 'styles') {
        return true
      }

      if (
        node.type === 'MemberExpression' &&
        node.object?.type === 'Identifier' &&
        node.object.name === 'styles'
      ) {
        return true
      }

      for (const key of Object.keys(node)) {
        if (skipKeys.has(key)) {
          // eslint-disable-next-line no-continue
          continue
        }

        const child = node[key]

        if (Array.isArray(child)) {
          if (child.some(hasStylesReference)) return true
        } else if (child && typeof child === 'object') {
          if (hasStylesReference(child)) return true
        }
      }

      return false
    }

    return {
      CallExpression(node: ASTNode) {
        const funcName = node.callee?.name

        if (!funcName || !workletNames.has(funcName)) return

        const fn = node.arguments?.[0]

        if (
          !fn ||
          (fn.type !== 'ArrowFunctionExpression' &&
            fn.type !== 'FunctionExpression')
        ) {
          return
        }

        if (hasStylesReference(fn.body)) {
          context.report({ node: fn, messageId: 'noCapture' })
        }
      },
    }
  },
}
