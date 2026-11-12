import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

import { parse } from 'yaml'

const read = (file) => readFileSync(file, 'utf8')

const readMapping = (text) => {
  const value = parse(text)
  assert(
    value && typeof value === 'object' && !Array.isArray(value),
    'expected YAML mapping'
  )

  return value
}

const checkFrontmatter = (file, name) => {
  const match = read(file).match(
    /^---\r?\n(?<metadata>[\s\S]*?)\r?\n---(?:\r?\n|$)/u
  )
  assert(match, 'missing YAML frontmatter')
  const metadata = readMapping(match.groups.metadata)
  assert(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(name) && name.length <= 64,
    'invalid skill name'
  )
  assert.equal(metadata.name, name, 'name must match the skill directory')
  assert(
    typeof metadata.description === 'string' && metadata.description.trim(),
    'missing description'
  )
}

const checkManifest = (file, name) => {
  const metadata = readMapping(read(file))

  if (metadata.interface === undefined) return

  const ui = metadata.interface
  assert(
    ui && typeof ui === 'object' && !Array.isArray(ui),
    'invalid interface mapping'
  )

  for (const [key, value] of Object.entries(ui)) {
    assert(
      typeof value === 'string' && value.trim(),
      `invalid interface.${key}`
    )
  }

  if (ui.short_description !== undefined) {
    assert(
      ui.short_description.length >= 25 && ui.short_description.length <= 64,
      'short_description must be 25–64 characters'
    )
  }

  if (ui.default_prompt !== undefined) {
    assert(
      ui.default_prompt.includes(`$${name}`),
      'default_prompt must mention its skill'
    )
  }
}

const checkLinks = (file, skillRoot) => {
  const text = read(file).replace(
    /^(?<fence>`{3,}|~{3,})[^\n]*\n[\s\S]*?^\k<fence>[ \t]*$/gmu,
    ''
  )

  for (const {
    groups: { target },
  } of text.matchAll(/\[[^\]]*\]\((?<target>[^)]+)\)/gu)) {
    const path = target.trim().replace(/^<|>$/gu, '')

    if (!/^[a-z][a-z0-9+.-]*:/iu.test(path) && !path.startsWith('#')) {
      assert(
        existsSync(
          resolve(dirname(file), decodeURIComponent(path.split('#')[0]))
        ),
        `missing link target: ${target}`
      )
    }
  }

  for (const {
    groups: { target },
  } of text.matchAll(/`(?<target>(?:references|scripts|assets)\/[^`\s]+)`/gu)) {
    assert(existsSync(join(skillRoot, target)), `missing resource: ${target}`)
  }
}

export const checkSkills = (repoRoot) => {
  const errors = []
  const check = (file, action) => {
    try {
      action()
    } catch (error) {
      errors.push(`${relative(repoRoot, file)}: ${error.message}`)
    }
  }
  const skillsRoot = join(repoRoot, '.agents/skills')
  const names = readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)

  for (const name of names) {
    const root = join(skillsRoot, name)
    const entry = join(root, 'SKILL.md')
    check(entry, () => checkFrontmatter(entry, name))
    const manifest = join(root, 'agents/openai.yaml')

    if (existsSync(manifest))
      check(manifest, () => checkManifest(manifest, name))

    const references = join(root, 'references')
    const documents = existsSync(references)
      ? readdirSync(references, { recursive: true })
          .filter(
            (path) =>
              path.endsWith('.md') && !path.split(sep).includes('vendor')
          )
          .map((path) => join(references, path))
      : []

    for (const file of [entry, ...documents])
      check(file, () => checkLinks(file, root))
  }

  const agents = join(repoRoot, 'AGENTS.md')
  check(agents, () => {
    for (const {
      groups: { name },
    } of read(agents).matchAll(/\$(?<name>[a-z][a-z0-9-]*)/gu)) {
      assert(names.includes(name), `unknown project skill: ${name}`)
    }
  })

  return errors
}

if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const errors = checkSkills(resolve(import.meta.dirname, '../..'))

  if (errors.length) {
    console.error(errors.join('\n'))
    process.exitCode = 1
  } else {
    console.log(
      'Project skill metadata, links, and AGENTS.md routing are valid.'
    )
  }
}
