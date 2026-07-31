import { resolve, join } from 'node:path'

import { compileTokens } from './core/compiler'
import type { CompiledTokens } from './core/types'
import {
  findGeneratedTokenIssues,
  type GeneratedTokenIssues,
  loadTokenTree,
  writeGeneratedTokens,
} from './io'

export const DESIGN_TOKENS_DIRECTORY = resolve(__dirname, '../../design-tokens')
export const INPUT_DIRECTORY = join(DESIGN_TOKENS_DIRECTORY, 'input')
export const TOKENS_DIRECTORY = resolve(__dirname, '../../src/theme/tokens')
export const INPUT_FILE = join(INPUT_DIRECTORY, 'tokens.json')

interface CliOptions {
  check: boolean
  help: boolean
}

const HELP = `Использование:
  yarn tokens:generate
  yarn tokens:check

Опции:
  --check    проверить актуальность сгенерированных токенов без записи
  --help     показать эту справку`

export const parseArgs = (arguments_: string[]): CliOptions => {
  const options: CliOptions = { check: false, help: false }

  for (const argument of arguments_) {
    if (argument === '--check') options.check = true
    else if (argument === '--help') options.help = true
    else {
      throw new Error(`Неизвестный аргумент "${argument}"`)
    }
  }

  return options
}

export const compileInputTokens = (): CompiledTokens =>
  compileTokens(loadTokenTree(INPUT_FILE))

const formatTokenIssues = (issues: GeneratedTokenIssues): string =>
  [
    issues.missing.length > 0
      ? `Отсутствуют: ${issues.missing.join(', ')}`
      : '',
    issues.changed.length > 0 ? `Изменены: ${issues.changed.join(', ')}` : '',
    issues.unexpected.length > 0
      ? `Лишние: ${issues.unexpected.join(', ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n')

export const run = (arguments_: string[]): void => {
  const options = parseArgs(arguments_)

  if (options.help) {
    console.log(HELP)

    return
  }

  const compiled = compileInputTokens()

  if (options.check) {
    const issues = findGeneratedTokenIssues(compiled, TOKENS_DIRECTORY)
    const issueDescription = formatTokenIssues(issues)

    if (issueDescription) {
      throw new Error(
        `Сгенерированные токены неактуальны:\n${issueDescription}\n` +
          'Запустите yarn tokens:generate.'
      )
    }

    console.log('Сгенерированные токены актуальны.')

    return
  }

  writeGeneratedTokens(compiled, TOKENS_DIRECTORY)
  console.log(`Сгенерированные токены записаны в ${TOKENS_DIRECTORY}`)
}

if (require.main === module) {
  try {
    run(process.argv.slice(2))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(message)
    process.exitCode = 1
  }
}
