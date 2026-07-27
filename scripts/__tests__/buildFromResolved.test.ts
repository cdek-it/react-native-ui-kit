/**
 * Проверяет, что тема (`themeLight.json` / `themeDark.json`) для всех компонентов
 * собирается ИСКЛЮЧИТЕЛЬНО из двух resolved-файлов
 * (`tokens.resolved.{light,dark}.json`) и ни одно значение не тянется из ранее
 * удалённых источников (`tokens.v2.numeric.json`, `tokens.semantic-source.json`).
 */
import * as fs from 'fs'
import * as path from 'path'

import {
  ASSETS_DIR,
  COMPONENT_MAP,
  FOUNDATION,
  RESOLVED,
  buildComponent,
  fixShorthands,
  resolveFoundationRole,
  type TokenTree,
} from '../buildFromResolved'

const themeLight: TokenTree = JSON.parse(
  fs.readFileSync(path.join(ASSETS_DIR, 'themeLight.json'), 'utf8')
)
const themeDark: TokenTree = JSON.parse(
  fs.readFileSync(path.join(ASSETS_DIR, 'themeDark.json'), 'utf8')
)
const srcLight: TokenTree = JSON.parse(fs.readFileSync(RESOLVED.light, 'utf8'))
const srcDark: TokenTree = JSON.parse(fs.readFileSync(RESOLVED.dark, 'utf8'))

describe('token base = только resolved-файлы', () => {
  it('в assets присутствуют оба resolved-файла', () => {
    expect(fs.existsSync(RESOLVED.light)).toBe(true)
    expect(fs.existsSync(RESOLVED.dark)).toBe(true)
  })

  it('удалённые источники токенов отсутствуют', () => {
    expect(fs.existsSync(path.join(ASSETS_DIR, 'tokens.v2.numeric.json'))).toBe(
      false
    )
    expect(
      fs.existsSync(path.join(ASSETS_DIR, 'tokens.semantic-source.json'))
    ).toBe(false)
  })

  it('в assets нет иных tokens*.json, кроме двух resolved', () => {
    const tokenFiles = fs
      .readdirSync(ASSETS_DIR)
      .filter((f) => /^tokens.*\.json$/.test(f))
      .sort()
    expect(tokenFiles).toEqual([
      'tokens.resolved.dark.json',
      'tokens.resolved.light.json',
    ])
  })

  it('resolved-файлы не содержат нерезолвленных ссылок {ref}', () => {
    const ref = /\{[a-z][^}]*\}/i
    expect(ref.test(JSON.stringify(srcLight.components))).toBe(false)
    expect(ref.test(JSON.stringify(srcDark.components))).toBe(false)
  })
})

describe('каждое значение темы воспроизводится из resolved-файла', () => {
  it.each(Object.entries(COMPONENT_MAP))(
    'theme.%s (light+dark) == сборка из resolved',
    (themeKey, tokenKey) => {
      expect(fixShorthands(buildComponent(srcLight, tokenKey, 'light'))).toEqual(
        themeLight[themeKey]
      )
      expect(fixShorthands(buildComponent(srcDark, tokenKey, 'dark'))).toEqual(
        themeDark[themeKey]
      )
    }
  )
})

describe('foundation-ключи (Typography) собираются из semantic-слоя resolved-файла', () => {
  it.each(Object.entries(FOUNDATION))(
    'theme.%s (light+dark) == роли semantic.color.* из resolved',
    (themeKey, roles) => {
      const build = (src: TokenTree) =>
        Object.fromEntries(
          Object.entries(roles).map(([name, role]) => [
            name,
            resolveFoundationRole(src, role),
          ])
        )
      expect(build(srcLight)).toEqual(themeLight[themeKey])
      expect(build(srcDark)).toEqual(themeDark[themeKey])
    }
  )
})
