import {
  readFileSync,
  readdirSync,
  mkdirSync,
  writeFileSync,
  renameSync,
  existsSync,
  unlinkSync,
} from 'node:fs'
import { dirname, join } from 'node:path'

import { format, resolveConfig, type Options } from 'prettier'

import { isTokenTree, type CompiledTokens, type TokenTree } from './core/types'

export const OUTPUT_FILES = {
  fonts: 'fonts.json',
  semantic: {
    colorScheme: {
      light: join('semantic', 'colorScheme', 'light.json'),
      dark: join('semantic', 'colorScheme', 'dark.json'),
    },
    dimensions: join('semantic', 'dimensions.json'),
    effects: join('semantic', 'effects.json'),
  },
  components: {
    light: join('components', 'light.json'),
    dark: join('components', 'dark.json'),
  },
} as const

export const parseTokenTree = (
  contents: string,
  filePath: string
): TokenTree => {
  const parsed: unknown = JSON.parse(contents)

  if (!isTokenTree(parsed)) {
    throw new Error(`Expected an object in "${filePath}"`)
  }

  return parsed
}

export const loadTokenTree = (filePath: string): TokenTree =>
  parseTokenTree(readFileSync(filePath, 'utf8'), filePath)

export const renderJson = (
  value: TokenTree,
  options: Options = {}
): Promise<string> =>
  format(JSON.stringify(value), { ...options, parser: 'json' })

const outputEntries = (
  compiled: CompiledTokens
): Array<[string, TokenTree]> => [
  [OUTPUT_FILES.fonts, compiled.fonts],
  [
    OUTPUT_FILES.semantic.colorScheme.light,
    compiled.semantic.colorScheme.light,
  ],
  [OUTPUT_FILES.semantic.colorScheme.dark, compiled.semantic.colorScheme.dark],
  [OUTPUT_FILES.semantic.dimensions, compiled.semantic.dimension],
  [OUTPUT_FILES.semantic.effects, compiled.semantic.effects],
  [OUTPUT_FILES.components.light, compiled.components.light],
  [OUTPUT_FILES.components.dark, compiled.components.dark],
]

const renderOutputEntries = async (
  compiled: CompiledTokens,
  outputDirectory: string
): Promise<Array<[string, string]>> => {
  const options =
    (await resolveConfig(join(outputDirectory, OUTPUT_FILES.fonts))) ?? {}

  return Promise.all(
    outputEntries(compiled).map(async ([fileName, value]) => [
      fileName,
      await renderJson(value, options),
    ])
  )
}

export const writeGeneratedTokens = async (
  compiled: CompiledTokens,
  outputDirectory: string
): Promise<void> => {
  const entries = await renderOutputEntries(compiled, outputDirectory)

  mkdirSync(outputDirectory, { recursive: true })

  const expectedFiles = new Set(entries.map(([fileName]) => fileName))

  for (const fileName of findJsonFiles(outputDirectory)) {
    if (!expectedFiles.has(fileName)) {
      unlinkSync(join(outputDirectory, fileName))
    }
  }

  for (const [fileName, contents] of entries) {
    const outputPath = join(outputDirectory, fileName)
    const temporaryPath = `${outputPath}.tmp`

    mkdirSync(dirname(outputPath), { recursive: true })
    writeFileSync(temporaryPath, contents)
    renameSync(temporaryPath, outputPath)
  }
}

const findJsonFiles = (directory: string, prefix = ''): string[] => {
  if (!existsSync(directory)) return []

  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const relativePath = join(prefix, entry.name)

      if (entry.isDirectory()) {
        return findJsonFiles(join(directory, entry.name), relativePath)
      }

      return entry.isFile() && entry.name.endsWith('.json')
        ? [relativePath]
        : []
    })
    .sort()
}

export interface GeneratedTokenIssues {
  missing: string[]
  changed: string[]
  unexpected: string[]
}

export const findGeneratedTokenIssues = async (
  compiled: CompiledTokens,
  outputDirectory: string
): Promise<GeneratedTokenIssues> => {
  const entries = await renderOutputEntries(compiled, outputDirectory)
  const expectedFiles = new Set(entries.map(([fileName]) => fileName))
  const missing: string[] = []
  const changed: string[] = []

  for (const [fileName, contents] of entries) {
    const outputPath = join(outputDirectory, fileName)

    if (existsSync(outputPath)) {
      if (readFileSync(outputPath, 'utf8') !== contents) {
        changed.push(fileName)
      }
    } else {
      missing.push(fileName)
    }
  }

  const unexpected = findJsonFiles(outputDirectory).filter(
    (fileName) => !expectedFiles.has(fileName)
  )

  return { missing, changed, unexpected }
}
