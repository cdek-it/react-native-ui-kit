import { defineConfig } from 'eslint/config'

import type { ASTNode, RuleContext } from './types'

/**
 * Правило: не распаковывать стили из unistyles
 * ❌ { ...styles.button }
 * ❌ const btn = { ...styles.button, marginTop: 10 }
 * ✅ [styles.button, customStyle]
 */
const noSpreadUnistyles = {
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

/**
 * Правило: не захватывать styles в worklet closures
 * ❌ useAnimatedStyle(() => ({ color: styles.text.color }))
 */
const noUnistylesInWorklet = {
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

/**
 * Правило: не спредить styles в Icon компонентах
 * ❌ <Icon {...styles.icon} />
 * ✅ <Icon width={24} height={24} color={color} />
 */
const noSpreadIconStyles = {
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

/**
 * Интегрируем все правила в конфиг
 */
export const unistylesConfig = defineConfig([
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      unistyles: {
        rules: {
          'no-spread-unistyles': noSpreadUnistyles,
          'no-unistyles-in-worklet': noUnistylesInWorklet,
          'no-spread-icon-styles': noSpreadIconStyles,
        },
      },
    },
    rules: {
      'unistyles/no-spread-unistyles': 'error',
      'unistyles/no-unistyles-in-worklet': 'error',
      'unistyles/no-spread-icon-styles': 'warn',
    },
  },
])
