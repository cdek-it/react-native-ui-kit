import { readdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
  INPUT_DIRECTORY,
  INPUT_FILE,
  TOKENS_DIRECTORY,
  parseArgs,
} from '../build'
import { compileTokens } from '../core/compiler'
import {
  convertUnit,
  normalizeTree,
  parseBoxShorthand,
} from '../core/normalization'
import { resolveReferences } from '../core/resolution'
import {
  isTokenTree,
  type CompiledTokens,
  type TokenTree,
  type TokenValue,
} from '../core/types'
import {
  OUTPUT_FILES,
  findStaleGeneratedTokens,
  loadTokenTree,
  writeGeneratedTokens,
} from '../io'

const listJsonFiles = (directory: string, prefix = ''): string[] =>
  readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const relativePath = join(prefix, entry.name)

      return entry.isDirectory()
        ? listJsonFiles(join(directory, entry.name), relativePath)
        : entry.name.endsWith('.json')
          ? [relativePath]
          : []
    })
    .sort()

const containsColorSchemeThemeBranch = (node: TokenValue): boolean => {
  if (Array.isArray(node)) return node.some(containsColorSchemeThemeBranch)

  if (!isTokenTree(node)) return false

  return Object.entries(node).some(([key, value]) => {
    if (
      key === 'colorScheme' &&
      isTokenTree(value) &&
      ('light' in value || 'dark' in value)
    ) {
      return true
    }

    return containsColorSchemeThemeBranch(value)
  })
}

describe('token compiler', () => {
  describe('convertUnit', () => {
    test.each([
      { name: 'положительный rem', value: '1.5rem', expected: 24 },
      { name: 'отрицательный rem', value: '-0.5rem', expected: -8 },
      { name: 'миллисекунды', value: '150ms', expected: 150 },
      { name: 'строковый ноль', value: '0', expected: 0 },
      {
        name: 'rem внутри составной строки',
        value: 'inset 0 0 0 0.25rem #fff',
        expected: 'inset 0 0 0 4px #fff',
      },
      { name: 'обычная строка', value: 'auto', expected: 'auto' },
    ])('$name преобразуется в ожидаемое значение', ({ value, expected }) => {
      expect(convertUnit(value)).toBe(expected)
    })
  })

  describe('parseBoxShorthand', () => {
    test.each([
      {
        name: 'одно значение',
        value: '8',
        expected: { top: 8, right: 8, bottom: 8, left: 8 },
      },
      {
        name: 'два значения',
        value: '8 14',
        expected: { top: 8, right: 14, bottom: 8, left: 14 },
      },
      {
        name: 'три значения',
        value: '8 14 10',
        expected: { top: 8, right: 14, bottom: 10, left: 14 },
      },
      {
        name: 'четыре значения с rem',
        value: '0rem 1.5rem 0.875rem 1.5rem',
        expected: { top: 0, right: 24, bottom: 14, left: 24 },
      },
    ])('$name раскрывается по правилам CSS', ({ value, expected }) => {
      expect(parseBoxShorthand(value)).toStrictEqual(expected)
    })

    test.each([
      { name: 'пустая строка', value: '', message: 'Expected 1-4 box values' },
      {
        name: 'пять значений',
        value: '1 2 3 4 5',
        message: 'Expected 1-4 box values',
      },
      {
        name: 'неподдерживаемая единица',
        value: '1px 2px',
        message: 'Invalid box value',
      },
      {
        name: 'нечисловое значение',
        value: 'auto',
        message: 'Invalid box value',
      },
    ])('$name отклоняется', ({ value, message }) => {
      expect(() => parseBoxShorthand(value)).toThrow(message)
    })
  })

  describe('normalizeTree', () => {
    test('одинаковые радиусы сворачивает в одно значение', () => {
      expect(
        normalizeTree({ borderRadius: '0rem 0rem 0rem 0rem' })
      ).toStrictEqual({ borderRadius: 0 })
    })

    test('разные радиусы сохраняет отдельными значениями', () => {
      expect(
        normalizeTree({ borderRadius: '0.25rem 0.5rem 0.75rem 1rem' })
      ).toStrictEqual({
        borderRadius: { left: 16, top: 4, right: 8, bottom: 12 },
      })
    })
  })

  test('разделяет один источник на темы, разрешает ссылки и нормализует значения', () => {
    const source: TokenTree = {
      primitive: {
        sizing: { small: '0.5rem', base: '1rem' },
        motion: { fast: '150ms' },
      },
      semantic: {
        dimension: {
          spacing: { small: '{sizing.small}', base: '{sizing.base}' },
        },
        effects: { duration: '{motion.fast}' },
        colorScheme: {
          light: { color: { text: '#111111' } },
          dark: { color: { text: '#eeeeee' } },
        },
      },
      components: {
        demo: {
          extend: {
            padding: '{dimension.spacing.small} {dimension.spacing.base}',
          },
          root: {
            margin: '{dimension.spacing.base}',
            duration: '{effects.duration}',
            borderWidth: '0rem 0rem {dimension.spacing.small} 0rem',
          },
          icon: { size: '{dimension.spacing.base}' },
          colorScheme: {
            light: { color: '{color.text}' },
            dark: { color: '{color.text}' },
          },
        },
      },
    }

    const compiled = compileTokens(source)

    expect(compiled).not.toHaveProperty('primitive')
    expect(compiled.semantic).toStrictEqual({
      light: {
        colorScheme: { color: { text: '#111111' } },
        dimension: { spacing: { small: 8, base: 16 } },
        effects: { duration: 150 },
      },
      dark: {
        colorScheme: { color: { text: '#eeeeee' } },
        dimension: { spacing: { small: 8, base: 16 } },
        effects: { duration: 150 },
      },
    })
    expect(compiled.components.light).toStrictEqual({
      demo: {
        extend: {
          paddingTop: 8,
          paddingRight: 16,
          paddingBottom: 8,
          paddingLeft: 16,
        },
        root: {
          margin: 16,
          duration: 150,
          borderTopWidth: 0,
          borderRightWidth: 0,
          borderBottomWidth: 8,
          borderLeftWidth: 0,
        },
        icon: { size: 16 },
        colorScheme: { color: '#111111' },
      },
    })
    expect(compiled.components.dark.demo).toHaveProperty(
      'colorScheme.color',
      '#eeeeee'
    )
    expect(compiled.components.light.demo).not.toHaveProperty(
      'colorScheme.light'
    )
    expect(compiled.components.dark.demo).not.toHaveProperty('colorScheme.dark')
  })

  test('отклоняет источник без одной из цветовых схем semantic', () => {
    const source: TokenTree = {
      primitive: {},
      semantic: { colorScheme: { light: {} } },
      components: {},
    }

    expect(() => compileTokens(source)).toThrow(
      'Expected an object at "semantic.colorScheme.dark"'
    )
  })

  test('отклоняет циклические ссылки', () => {
    const references: TokenTree = { first: '{second}', second: '{first}' }

    expect(() => resolveReferences('{first}', references)).toThrow(
      'Circular token reference'
    )
  })
})

describe('production input tokens', () => {
  const source = loadTokenTree(INPUT_FILE)
  const compiled: CompiledTokens = compileTokens(source)

  test('использует единственный входной tokens-файл', () => {
    const tokenFiles = readdirSync(INPUT_DIRECTORY)
      .filter((fileName) => /\.json$/.test(fileName))
      .sort()

    expect(tokenFiles).toStrictEqual(['tokens.json'])
  })

  test('не экспортирует primitive и убирает разделение тем из colorScheme', () => {
    expect(Object.keys(compiled)).toStrictEqual(['semantic', 'components'])
    expect(compiled).not.toHaveProperty('primitive')

    const inputComponents = source.components
    const lightOutputComponents = compiled.components.light
    const darkOutputComponents = compiled.components.dark

    if (
      !isTokenTree(inputComponents) ||
      !isTokenTree(inputComponents.button) ||
      !isTokenTree(lightOutputComponents.button)
    ) {
      throw new Error('Expected component namespaces')
    }

    expect(Object.keys(lightOutputComponents).sort()).toStrictEqual(
      Object.keys(inputComponents).sort()
    )
    expect(Object.keys(darkOutputComponents).sort()).toStrictEqual(
      Object.keys(inputComponents).sort()
    )
    expect(lightOutputComponents.button).toHaveProperty('extend')
    expect(lightOutputComponents.button).toHaveProperty('root')
    expect(lightOutputComponents.button).toHaveProperty('colorScheme')
    expect(darkOutputComponents.button).toHaveProperty('colorScheme')
    expect(compiled.semantic.light).toHaveProperty('colorScheme.color')
    expect(compiled.semantic.dark).toHaveProperty('colorScheme.color')
    expect(
      [
        compiled.semantic.light,
        compiled.semantic.dark,
        compiled.components.light,
        compiled.components.dark,
      ].filter(containsColorSchemeThemeBranch)
    ).toHaveLength(0)
  })

  test('содержит только целевые файлы', () => {
    const tokenFiles = listJsonFiles(TOKENS_DIRECTORY)
    const expectedFiles = Object.values(OUTPUT_FILES)
      .flatMap((group) => Object.values(group))
      .sort()

    expect(tokenFiles).toStrictEqual(expectedFiles)
  })

  test('не содержит неразрешённых ссылок и CSS-единиц', () => {
    const serialized = JSON.stringify(compiled)

    expect(serialized).not.toMatch(/\{[a-z][^}]*\}/i)
    expect(serialized).not.toMatch(/-?\d*\.?\d+(?:rem|ms)\b/)
  })

  test('совпадает с закоммиченными сгенерированными токенами', () => {
    expect(findStaleGeneratedTokens(compiled, TOKENS_DIRECTORY)).toStrictEqual(
      []
    )
  })

  test('component-токены содержат выбранную схему на исходных путях', () => {
    expect(compiled.components.light.accordion).toHaveProperty('root')
    expect(compiled.components.light.accordion).toHaveProperty('extend')
    expect(compiled.components.light.accordion).toHaveProperty(
      'colorScheme.header.background'
    )
    expect(compiled.components.dark.accordion).toHaveProperty(
      'colorScheme.header.background'
    )
    expect(compiled.components.light.dataview).toHaveProperty(
      'header.borderRadius',
      0
    )
    expect(compiled.components.dark.dataview).toHaveProperty(
      'footer.borderRadius',
      0
    )
  })

  test('после записи повторная проверка не находит изменений', () => {
    const temporaryDirectory = mkdtempSync(join(tmpdir(), 'token-generator-'))

    try {
      writeGeneratedTokens(compiled, temporaryDirectory)

      expect(listJsonFiles(temporaryDirectory)).toStrictEqual(
        Object.values(OUTPUT_FILES)
          .flatMap((group) => Object.values(group))
          .sort()
      )
      expect(
        findStaleGeneratedTokens(compiled, temporaryDirectory)
      ).toStrictEqual([])

      writeFileSync(join(temporaryDirectory, 'common.json'), '{}\n')

      expect(findStaleGeneratedTokens(compiled, temporaryDirectory)).toContain(
        'common.json'
      )

      writeFileSync(
        join(temporaryDirectory, OUTPUT_FILES.semantic.light),
        '{}\n'
      )

      expect(findStaleGeneratedTokens(compiled, temporaryDirectory)).toContain(
        OUTPUT_FILES.semantic.light
      )
    } finally {
      rmSync(temporaryDirectory, { recursive: true, force: true })
    }
  })
})

describe('token generator CLI', () => {
  test('распознаёт check-режим', () => {
    expect(parseArgs(['--check'])).toStrictEqual({ check: true, help: false })
  })

  test('отклоняет неизвестный аргумент', () => {
    expect(() => parseArgs(['--unknown'])).toThrow(
      'Неизвестный аргумент "--unknown"'
    )
  })
})
