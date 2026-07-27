/**
 * buildFromResolved — собирает `themeLight.json` / `themeDark.json` из ПРЕД-резолвленных
 * per-scheme файлов semantic-модели (`build/tokens.resolved.{light,dark}.json`).
 *
 * Рефы (`{color.*}` и пр.) уже разрешены пайплайном semantic-модели, поэтому здесь
 * НЕТ резолва ссылок — только сборка компонента (merge `extend + root + siblings +
 * colorScheme[scheme]`) и числовая конверсия единиц (`rem → ×16`, `ms → number`).
 * Единственный источник значений — два resolved-файла; никаких других токен-файлов.
 *
 * Light-тема строится из `tokens.resolved.light.json` (схема `light`),
 * dark — из `tokens.resolved.dark.json` (схема `dark`).
 *
 * Запуск: `ts-node scripts/buildFromResolved.ts [--component <ThemeKey>] [--dry-run]`
 * Без `--component` — все смигрированные компоненты из `COMPONENT_MAP`.
 */
import * as fs from 'fs'
import * as path from 'path'

export type TokenTree = Record<string, any>

export const ASSETS_DIR = path.resolve(__dirname, '../src/theme/assets')
export const RESOLVED = {
  light: path.join(ASSETS_DIR, 'tokens.resolved.light.json'),
  dark: path.join(ASSETS_DIR, 'tokens.resolved.dark.json'),
}

/** ThemeKey (ключ в теме) → tokenKey (ключ в слое `components`). */
export const COMPONENT_MAP: Record<string, string> = {
  Button: 'button',
  InputSwitch: 'toggleswitch',
  ProgressSpinner: 'progressspinner',
  Skeleton: 'skeleton',
  ProgressBar: 'progressbar',
  Divider: 'divider',
  Avatar: 'avatar',
  Badge: 'badge',
  Accordion: 'accordion',
  Chip: 'chip',
  Tag: 'tag',
  Dialog: 'dialog',
  Checkbox: 'checkbox',
  Slider: 'slider',
  RadioButton: 'radiobutton',
  Tabs: 'tabs',
  Input: 'inputtext',
  InputGroup: 'inputgroup',
  InputOtp: 'inputotp',
  MenuItem: 'menu',
  Message: 'message',
  SelectButton: 'selectbutton',
  ToggleButton: 'togglebutton',
  Rating: 'rating',
}

/**
 * Foundation-ключи темы без компонент-токена: значения берутся из семантического
 * слоя `semantic.color.*` того же resolved-файла (уже разрезолвлен per-scheme).
 * Typography — фундаментальные цвета текста (роли `fg.*`).
 */
export const FOUNDATION: Record<string, Record<string, string>> = {
  Typography: {
    default: 'color.fg.default',
    primary: 'color.fg.brand.default',
    secondary: 'color.fg.muted',
  },
}

function load(file: string): TokenTree {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

const REM_BASE = 16

/** Числовая конверсия одиночного листа: `"N rem"` → `N*16`, `"N ms"` → `N`, `"0"` → 0. */
function convertUnit(value: unknown): unknown {
  if (typeof value !== 'string') return value
  const rem = value.match(/^(-?\d*\.?\d+)rem$/)
  if (rem) return parseFloat(rem[1]) * REM_BASE
  const ms = value.match(/^(-?\d*\.?\d+)ms$/)
  if (ms) return parseFloat(ms[1])
  if (value === '0') return 0
  return value
}

/** Глубокое слияние объектов (последующие переопределяют предыдущие). */
function deepMerge(...objs: TokenTree[]): TokenTree {
  const result: TokenTree = {}
  for (const obj of objs) {
    for (const [key, val] of Object.entries(obj ?? {})) {
      if (
        val &&
        typeof val === 'object' &&
        !Array.isArray(val) &&
        result[key] &&
        typeof result[key] === 'object' &&
        !Array.isArray(result[key])
      ) {
        result[key] = deepMerge(result[key], val)
      } else {
        result[key] = val
      }
    }
  }
  return result
}

/**
 * Собирает разрешённое дерево токена компонента для схемы: `extend` + `root` +
 * именованные sibling-блоки (`handle/icon/track/…`) + `colorScheme[scheme]`, затем
 * числовая конверсия единиц. Рефов в resolved-файлах нет — резолв не требуется.
 */
export function buildComponent(
  src: TokenTree,
  tokenKey: string,
  scheme: 'light' | 'dark'
): TokenTree {
  const comp = src.components?.[tokenKey]
  if (!comp) throw new Error(`No component "${tokenKey}" in resolved file`)
  const { extend = {}, root = {}, colorScheme, ...siblings } = comp
  const merged = deepMerge(extend, root, siblings, colorScheme?.[scheme] ?? {})
  const walk = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(walk)
    if (node && typeof node === 'object') {
      const out: TokenTree = {}
      for (const [k, v] of Object.entries(node)) out[k] = walk(v)
      return out
    }
    return convertUnit(node)
  }
  return walk(merged) as TokenTree
}

/**
 * Конверсия МНОГОЗНАЧНЫХ CSS-shorthand строк (`"0rem 0.875rem"` → `"0 14"`).
 * `convertUnit` обрабатывает только одиночные значения, поэтому shorthand-паддинги
 * из resolved-файлов остаются rem-строками и ломают потребителей вроде
 * `parseEdgeInsets` (`Number("0.875rem")` → NaN).
 */
function convertShorthand(value: unknown): unknown {
  if (typeof value !== 'string' || !value.includes(' ')) return value
  const parts = value.trim().split(/\s+/)
  const numeric = /^(-?\d*\.?\d+)(rem|ms)?$/
  if (!parts.every((p) => numeric.test(p))) return value
  return parts
    .map((p) => {
      const rem = p.match(/^(-?\d*\.?\d+)rem$/)
      if (rem) return String(parseFloat(rem[1]) * REM_BASE)
      const ms = p.match(/^(-?\d*\.?\d+)ms$/)
      if (ms) return ms[1]
      return p
    })
    .join(' ')
}

/** Рекурсивно применяет `convertShorthand` ко всем листьям дерева. */
export function fixShorthands(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(fixShorthands)
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(node)) out[k] = fixShorthands(v)
    return out
  }
  return convertShorthand(node)
}

/** Читает разрешённую semantic-роль (`color.fg.default`) из resolved-файла схемы. */
export function resolveFoundationRole(src: TokenTree, role: string): unknown {
  const val = role.split('.').reduce<any>((acc, seg) => acc?.[seg], src.semantic)
  if (val === undefined) throw new Error(`No semantic role "${role}" in resolved file`)
  return convertUnit(val)
}

export function writeResolvedTheme(
  themeKeys: string[],
  options: { dryRun?: boolean } = {}
): void {
  const srcLight = load(RESOLVED.light)
  const srcDark = load(RESOLVED.dark)
  const themeLightPath = path.join(ASSETS_DIR, 'themeLight.json')
  const themeDarkPath = path.join(ASSETS_DIR, 'themeDark.json')
  const themeLight = JSON.parse(fs.readFileSync(themeLightPath, 'utf8'))
  const themeDark = JSON.parse(fs.readFileSync(themeDarkPath, 'utf8'))

  for (const themeKey of themeKeys) {
    const foundation = FOUNDATION[themeKey]
    if (foundation) {
      const build = (src: TokenTree) =>
        Object.fromEntries(
          Object.entries(foundation).map(([name, role]) => [
            name,
            resolveFoundationRole(src, role),
          ])
        )
      themeLight[themeKey] = build(srcLight)
      themeDark[themeKey] = build(srcDark)
      continue
    }
    const tokenKey = COMPONENT_MAP[themeKey]
    if (!tokenKey) {
      throw new Error(`No tokenKey mapping for "${themeKey}"`)
    }
    themeLight[themeKey] = fixShorthands(buildComponent(srcLight, tokenKey, 'light'))
    themeDark[themeKey] = fixShorthands(buildComponent(srcDark, tokenKey, 'dark'))
  }

  if (!options.dryRun) {
    fs.writeFileSync(themeLightPath, `${JSON.stringify(themeLight, null, 2)}\n`)
    fs.writeFileSync(themeDarkPath, `${JSON.stringify(themeDark, null, 2)}\n`)
  }
}

function parseArgs(argv: string[]): { component?: string; dryRun: boolean } {
  const args = { dryRun: false } as { component?: string; dryRun: boolean }
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--component') args.component = argv[(i += 1)]
    else if (argv[i] === '--dry-run') args.dryRun = true
  }
  return args
}

if (require.main === module) {
  const { component, dryRun } = parseArgs(process.argv.slice(2))
  const keys = component
    ? [component]
    : [...Object.keys(COMPONENT_MAP), ...Object.keys(FOUNDATION)]
  writeResolvedTheme(keys, { dryRun })
  console.log(
    `${dryRun ? '[dry-run] ' : ''}Собрана тема из resolved-файлов для: ${keys.join(', ')}`
  )
}
