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
import { isDeepStrictEqual } from 'node:util'

import { isTokenTree, type CompiledTokens, type TokenTree } from './core/types'

export const OUTPUT_FILES = {
  fonts: 'fonts.json',
  semantic: {
    light: join('semantic', 'light.json'),
    dark: join('semantic', 'dark.json'),
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

export const renderJson = (value: TokenTree): string =>
  `${JSON.stringify(value, null, 2)}\n`

const outputEntries = (
  compiled: CompiledTokens
): Array<[string, TokenTree]> => [
  [OUTPUT_FILES.fonts, compiled.fonts],
  [OUTPUT_FILES.semantic.light, compiled.semantic.light],
  [OUTPUT_FILES.semantic.dark, compiled.semantic.dark],
  [OUTPUT_FILES.components.light, compiled.components.light],
  [OUTPUT_FILES.components.dark, compiled.components.dark],
]

export const writeGeneratedTokens = (
  compiled: CompiledTokens,
  outputDirectory: string
): void => {
  mkdirSync(outputDirectory, { recursive: true })

  const expectedFiles = new Set(
    outputEntries(compiled).map(([fileName]) => fileName)
  )

  for (const fileName of findJsonFiles(outputDirectory)) {
    if (!expectedFiles.has(fileName)) {
      unlinkSync(join(outputDirectory, fileName))
    }
  }

  for (const [fileName, value] of outputEntries(compiled)) {
    const outputPath = join(outputDirectory, fileName)
    const temporaryPath = `${outputPath}.tmp`

    mkdirSync(dirname(outputPath), { recursive: true })
    writeFileSync(temporaryPath, renderJson(value))
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

export const findGeneratedTokenIssues = (
  compiled: CompiledTokens,
  outputDirectory: string
): GeneratedTokenIssues => {
  const entries = outputEntries(compiled)
  const expectedFiles = new Set(entries.map(([fileName]) => fileName))
  const missing: string[] = []
  const changed: string[] = []

  for (const [fileName, value] of entries) {
    const outputPath = join(outputDirectory, fileName)

    if (existsSync(outputPath)) {
      try {
        if (!isDeepStrictEqual(loadTokenTree(outputPath), value)) {
          changed.push(fileName)
        }
      } catch {
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
