import {
  accessSync,
  readdirSync,
  mkdtempSync,
  writeFileSync,
  rmSync,
} from 'node:fs'
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
import { assertValidOutput } from '../core/validation'
import {
  OUTPUT_FILES,
  findGeneratedTokenIssues,
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
      { name: 'пиксели', value: '4px', expected: 4 },
      { name: 'числовая строка', value: '0.4', expected: 0.4 },
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

    test('отклоняет rem внутри неподдерживаемой составной строки', () => {
      expect(() => convertUnit('blur(1rem)', 'semantic.effects.blur')).toThrow(
        'Unsupported composite unit value "blur(1rem)" at "semantic.effects.blur"'
      )
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
      {
        name: 'значения с px',
        value: '4px 8px 12px 16px',
        expected: { top: 4, right: 8, bottom: 12, left: 16 },
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
        value: '1em 2em',
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

    test('преобразует числовые строки, включая fontWeight', () => {
      expect(
        normalizeTree({ depth: '1000', opacity: '0.4', fontWeight: '600' })
      ).toStrictEqual({ depth: 1000, opacity: 0.4, fontWeight: 600 })
    })
  })

  describe('assertValidOutput', () => {
    test.each(['4px', '0.4', 'blur(4px)'])(
      'отклоняет непреобразованное значение %s',
      (value) => {
        expect(() => assertValidOutput(value, 'semantic.value')).toThrow(
          'Unconverted token'
        )
      }
    )

    test('разрешает boxShadow', () => {
      expect(() =>
        assertValidOutput('0 0 4px #000', 'components.button.shadow')
      ).not.toThrow()
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
    expect(findGeneratedTokenIssues(compiled, TOKENS_DIRECTORY)).toStrictEqual({
      missing: [],
      changed: [],
      unexpected: [],
    })
  })

  test('преобразует числовые RN-значения', () => {
    expect(compiled.semantic.light).toHaveProperty('dimension.depth.100', 1000)
    expect(compiled.semantic.light).toHaveProperty('effects.opacity.4', 0.04)
    expect(compiled.semantic.light).toHaveProperty('effects.blur.100', 4)
    expect(compiled.components.light).toHaveProperty(
      'button.root.label.fontWeight',
      600
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

  test('check находит расхождения, а generate приводит файлы к актуальному состоянию', () => {
    const temporaryDirectory = mkdtempSync(join(tmpdir(), 'token-generator-'))
    const unexpectedFile = join(temporaryDirectory, 'common.json')
    const preservedFile = join(temporaryDirectory, 'README.md')
    const missingFile = OUTPUT_FILES.semantic.dark
    const changedFile = OUTPUT_FILES.semantic.light

    try {
      writeGeneratedTokens(compiled, temporaryDirectory)

      expect(listJsonFiles(temporaryDirectory)).toStrictEqual(
        Object.values(OUTPUT_FILES)
          .flatMap((group) => Object.values(group))
          .sort()
      )
      expect(
        findGeneratedTokenIssues(compiled, temporaryDirectory)
      ).toStrictEqual({ missing: [], changed: [], unexpected: [] })

      writeFileSync(unexpectedFile, '{}\n')
      writeFileSync(preservedFile, '# Generated tokens\n')
      rmSync(join(temporaryDirectory, missingFile))
      writeFileSync(join(temporaryDirectory, changedFile), '{}\n')

      expect(
        findGeneratedTokenIssues(compiled, temporaryDirectory)
      ).toStrictEqual({
        missing: [missingFile],
        changed: [changedFile],
        unexpected: ['common.json'],
      })
      expect(() => accessSync(unexpectedFile)).not.toThrow()
      expect(() => accessSync(preservedFile)).not.toThrow()

      writeGeneratedTokens(compiled, temporaryDirectory)

      expect(
        findGeneratedTokenIssues(compiled, temporaryDirectory)
      ).toStrictEqual({ missing: [], changed: [], unexpected: [] })
      expect(() => accessSync(unexpectedFile)).toThrow('ENOENT')
      expect(() => accessSync(preservedFile)).not.toThrow()
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
