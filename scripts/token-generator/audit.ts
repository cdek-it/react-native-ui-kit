import { readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

import { loadTokenTree } from './io'

const SOURCE_DIRECTORY = resolve(__dirname, '../../src')
const THEME_DIRECTORY = resolve(__dirname, '../../src/theme')
const TODO_MARKER = 'TODO(tokens-migration)'
const SOURCE_EXTENSIONS = ['.ts', '.tsx']

/**
 * Неймспейс legacy-пути -> файл, в котором этот путь нужно искать.
 * Резолвим по light-варианту: dark отличается значениями, но не структурой.
 */
const NAMESPACE_SOURCES: Record<string, string> = {
  components: join(THEME_DIRECTORY, 'tokens/components/light.json'),
  semantic: join(THEME_DIRECTORY, 'tokens/semantic/light.json'),
  theme: join(THEME_DIRECTORY, 'assets/themeLight.json'),
  spacing: join(THEME_DIRECTORY, 'assets/spacing.json'),
  typography: join(THEME_DIRECTORY, 'assets/typography.json'),
  border: join(THEME_DIRECTORY, 'assets/border.json'),
  sizing: join(THEME_DIRECTORY, 'assets/sizing.json'),
  global: join(THEME_DIRECTORY, 'assets/global.json'),
  background: join(THEME_DIRECTORY, 'assets/background.json'),
}

/** Неймспейсы вне пайплайна токенов: резолвить нечем, нужно решение. */
const UNRESOLVABLE_NAMESPACES = new Set(['fonts', 'hardcode'])

/**
 * Поддеревья theme.*, которые подмешиваются в тему отдельно от themeLight.json
 * (см. lightTheme.ts) и лежат в каталоге по файлу на размер.
 */
const THEME_SUBTREE_DIRECTORIES = new Set(['InputSize', 'ModalSize'])

export type TodoStatus =
  | 'токен есть'
  | 'значение расходится'
  | 'токена нет'
  | 'вне пайплайна'

export interface TodoComment {
  file: string
  line: number
  reason: string
  legacy: string
  value: string
  light: string
  dark: string
  target: string
  targetValue: string
}

export interface AuditedTodo extends TodoComment {
  status: TodoStatus
  actual: string
}

const FIELD_PATTERN = /(?<key>\w+)=(?<value>[^;]+)/g

export const parseTodo = (
  text: string,
  file: string,
  line: number
): TodoComment | null => {
  const markerIndex = text.indexOf(TODO_MARKER)

  if (markerIndex === -1) return null

  const fields: Record<string, string> = {}

  for (const match of text
    .slice(markerIndex + TODO_MARKER.length)
    .matchAll(FIELD_PATTERN)) {
    const { key, value } = match.groups ?? {}

    if (key && value !== undefined) fields[key] = value.trim()
  }

  if (!fields.legacy) return null

  return {
    file,
    line,
    reason: fields.reason ?? '',
    legacy: fields.legacy,
    value: fields.value ?? '',
    light: fields.light ?? '',
    dark: fields.dark ?? '',
    target: fields.target ?? '',
    targetValue: fields.targetValue ?? '',
  }
}

const findSourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = join(directory, entry.name)

      if (entry.isDirectory()) return findSourceFiles(entryPath)

      return entry.isFile() &&
        SOURCE_EXTENSIONS.some((extension) => entry.name.endsWith(extension))
        ? [entryPath]
        : []
    })
    .sort()

export const collectTodos = (directory: string): TodoComment[] =>
  findSourceFiles(directory).flatMap((filePath) =>
    readFileSync(filePath, 'utf8')
      .split('\n')
      .flatMap((text, index) => {
        const todo = parseTodo(
          text,
          relative(resolve(__dirname, '../..'), filePath),
          index + 1
        )

        return todo ? [todo] : []
      })
  )

const treeCache = new Map<string, unknown>()

const readTree = (filePath: string): unknown => {
  if (!treeCache.has(filePath)) treeCache.set(filePath, loadTokenTree(filePath))

  return treeCache.get(filePath)
}

const readPath = (tree: unknown, segments: string[]): unknown =>
  segments.reduce<unknown>(
    (node, segment) =>
      node !== null && typeof node === 'object' && segment in node
        ? (node as Record<string, unknown>)[segment]
        : undefined,
    tree
  )

export const resolveLegacyPath = (legacy: string): unknown => {
  const [namespace, ...segments] = legacy.split('.')

  if (namespace === 'theme' && THEME_SUBTREE_DIRECTORIES.has(segments[0])) {
    const [subtree, size, ...rest] = segments
    const sizeFile = join(THEME_DIRECTORY, 'assets', subtree, `${size}.json`)

    return readPath(readTree(sizeFile), rest)
  }

  const sourceFile = NAMESPACE_SOURCES[namespace]

  if (!sourceFile) return undefined

  return readPath(readTree(sourceFile), segments)
}

const auditTodo = (todo: TodoComment): AuditedTodo => {
  const [namespace] = todo.legacy.split('.')

  if (UNRESOLVABLE_NAMESPACES.has(namespace)) {
    return { ...todo, status: 'вне пайплайна', actual: '' }
  }

  const actual = resolveLegacyPath(todo.legacy)

  if (actual === undefined) return { ...todo, status: 'токена нет', actual: '' }

  const actualText = String(actual)
  const expected = todo.targetValue || todo.value

  return {
    ...todo,
    actual: actualText,
    status:
      expected && actualText !== expected
        ? 'значение расходится'
        : 'токен есть',
  }
}

export const auditTodos = (todos: TodoComment[]): AuditedTodo[] =>
  todos.map(auditTodo)

const formatReport = (audited: AuditedTodo[]): string => {
  const byStatus = new Map<TodoStatus, AuditedTodo[]>()

  for (const todo of audited) {
    byStatus.set(todo.status, [...(byStatus.get(todo.status) ?? []), todo])
  }

  const sections = [...byStatus.entries()].map(([status, todos]) => {
    const rows = todos.map((todo) => {
      const expectation = todo.targetValue
        ? ` (ожидалось ${todo.targetValue})`
        : ''

      return `  ${todo.file}:${todo.line}\n    ${todo.legacy} -> ${todo.actual || '—'}${expectation}`
    })

    return `${status.toUpperCase()} — ${todos.length}\n${rows.join('\n')}`
  })

  const summary = [...byStatus.entries()]
    .map(([status, todos]) => `  ${status}: ${todos.length}`)
    .join('\n')

  return `${sections.join('\n\n')}\n\nВсего TODO: ${audited.length}\n${summary}`
}

const HELP = `Использование:
  yarn tokens:audit [--summary]

Проверяет комментарии ${TODO_MARKER} в src/: резолвит legacy-путь каждого TODO
в сгенерированных токенах и legacy-ассетах темы.

Опции:
  --summary  только сводка по статусам
  --help     показать эту справку`

export const run = (arguments_: string[]): void => {
  if (arguments_.includes('--help')) {
    console.log(HELP)

    return
  }

  const audited = auditTodos(collectTodos(SOURCE_DIRECTORY))
  const report = formatReport(audited)

  console.log(
    arguments_.includes('--summary')
      ? report.slice(report.indexOf('Всего TODO:'))
      : report
  )
}

if (require.main === module) {
  try {
    run(process.argv.slice(2))
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
