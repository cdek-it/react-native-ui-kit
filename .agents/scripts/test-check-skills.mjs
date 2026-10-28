import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'

import { checkSkills } from './check-skills.mjs'

const fixture = (context) => {
  const root = mkdtempSync(join(tmpdir(), 'ui-kit-skills-'))
  context.after(() => rmSync(root, { recursive: true, force: true }))
  const write = (path, text) => {
    const file = join(root, path)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, text)
  }
  write('AGENTS.md', 'Use $sample.\n')
  write(
    '.agents/skills/sample/SKILL.md',
    '---\nname: sample\ndescription: Example skill\n---\n[Guide](references/guide.md)\n'
  )
  write('.agents/skills/sample/references/guide.md', '# Guide\n')
  write(
    '.agents/skills/sample/agents/openai.yaml',
    'interface:\n  short_description: "Describe a valid example skill"\n  default_prompt: "Use $sample for this task."\n'
  )

  return { root, write }
}

test('accepts valid metadata, linked references, and project routing', (context) => {
  const { root, write } = fixture(context)
  write('.agents/skills/sample/vendor/copied/SKILL.md', 'not active metadata')
  assert.deepEqual(checkSkills(root), [])
})

test('reports malformed YAML in entrypoints and manifests', (context) => {
  const { root, write } = fixture(context)
  write(
    '.agents/skills/sample/SKILL.md',
    '---\nname: sample\nname: duplicate\n---\n'
  )
  write('.agents/skills/sample/agents/openai.yaml', 'interface: [\n')
  const errors = checkSkills(root)
  assert.equal(errors.length, 2)
  assert(
    errors.some((error) => error.startsWith('.agents/skills/sample/SKILL.md:'))
  )
  assert(
    errors.some((error) =>
      error.startsWith('.agents/skills/sample/agents/openai.yaml:')
    )
  )
})

test('reports missing links and literal resources while ignoring examples and remote URLs', (context) => {
  const { root, write } = fixture(context)
  write(
    '.agents/skills/sample/references/guide.md',
    '[Remote](https://example.com)\n[Section](#section)\n```md\n[Example](placeholder.md)\n```\n[Missing](missing.md)\n'
  )
  let errors = checkSkills(root)
  assert.equal(errors.length, 1)
  assert.match(errors[0], /missing\.md/u)
  write(
    '.agents/skills/sample/references/guide.md',
    'Run `scripts/missing.mjs`.\n'
  )
  errors = checkSkills(root)
  assert.equal(errors.length, 1)
  assert.match(errors[0], /scripts\/missing\.mjs/u)
})

test('reports a mismatched skill name, invalid prompt, and unresolved AGENTS routing', (context) => {
  const { root, write } = fixture(context)
  write(
    '.agents/skills/sample/SKILL.md',
    '---\nname: another\ndescription: Example skill\n---\n'
  )
  write(
    '.agents/skills/sample/agents/openai.yaml',
    'interface:\n  default_prompt: "Use $another."\n'
  )
  write('AGENTS.md', 'Use $missing.\n')
  const errors = checkSkills(root)
  assert.equal(errors.length, 3)
  assert(errors.some((error) => error.startsWith('AGENTS.md:')))
})
