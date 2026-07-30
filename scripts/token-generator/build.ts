import { resolve, join } from 'node:path'

import { compileTokens } from './core/compiler'
import type { CompiledTokens } from './core/types'
import {
  findStaleGeneratedTokens,
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

export const run = (arguments_: string[]): void => {
  const options = parseArgs(arguments_)

  if (options.help) {
    console.log(HELP)

    return
  }

  const compiled = compileInputTokens()

  if (options.check) {
    const staleFiles = findStaleGeneratedTokens(compiled, TOKENS_DIRECTORY)

    if (staleFiles.length > 0) {
      throw new Error(
        `Сгенерированные токены устарели: ${staleFiles.join(', ')}. ` +
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
