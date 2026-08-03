import {
  auditTodos,
  collectTodos,
  parseTodo,
  resolveLegacyPath,
} from '../audit'

describe('parseTodo', () => {
  test('разбирает поля комментария', () => {
    const todo = parseTodo(
      '// TODO(tokens-migration): reason=value-mismatch; legacy=spacing.Gap.gap-2; value=7; target=components.accordion.extend.extHeader.gap; targetValue=8',
      'src/components/Accordion/Accordion.tsx',
      168
    )

    expect(todo).toStrictEqual({
      file: 'src/components/Accordion/Accordion.tsx',
      line: 168,
      reason: 'value-mismatch',
      legacy: 'spacing.Gap.gap-2',
      value: '7',
      light: '',
      dark: '',
      target: 'components.accordion.extend.extHeader.gap',
      targetValue: '8',
    })
  })

  test('разбирает цветовые пары light/dark', () => {
    expect(
      parseTodo(
        '// TODO(tokens-migration): reason=missing; legacy=components.button.extend.disabledColor; light=#85888e; dark=#a2a5a9',
        'file.tsx',
        1
      )
    ).toMatchObject({ light: '#85888e', dark: '#a2a5a9', value: '' })
  })

  test('игнорирует строки без маркера и без legacy', () => {
    expect(parseTodo('const gap = 8', 'file.tsx', 1)).toBeNull()
    expect(
      parseTodo('// TODO(tokens-migration): reason=missing', 'file.tsx', 1)
    ).toBeNull()
  })
})

describe('resolveLegacyPath', () => {
  test('находит сгенерированные component- и semantic-токены', () => {
    expect(
      resolveLegacyPath('components.button.extend.disabledColor')
    ).toBeDefined()
    expect(
      resolveLegacyPath('semantic.colorScheme.color.fg.muted')
    ).toBeDefined()
  })

  test('находит поддеревья theme, подмешанные отдельно от themeLight.json', () => {
    expect(resolveLegacyPath('theme.InputSize.base.min-height')).toBe(35)
  })

  test('возвращает undefined для неймспейсов вне пайплайна', () => {
    expect(resolveLegacyPath('fonts.primary')).toBeUndefined()
    expect(resolveLegacyPath('hardcode.transparent')).toBeUndefined()
  })
})

describe('auditTodos', () => {
  test('классифицирует TODO по резолву legacy-пути', () => {
    const [existing, mismatched, outside] = auditTodos([
      {
        file: 'a.tsx',
        line: 1,
        reason: 'missing',
        legacy: 'theme.InputSize.base.min-height',
        value: '35',
        light: '',
        dark: '',
        target: '',
        targetValue: '',
      },
      {
        file: 'b.tsx',
        line: 2,
        reason: 'value-mismatch',
        legacy: 'theme.InputSize.base.min-height',
        value: '35',
        light: '',
        dark: '',
        target: '',
        targetValue: '99',
      },
      {
        file: 'c.tsx',
        line: 3,
        reason: 'missing',
        legacy: 'hardcode.transparent',
        value: 'transparent',
        light: '',
        dark: '',
        target: '',
        targetValue: '',
      },
    ])

    expect(existing.status).toBe('токен есть')
    expect(mismatched.status).toBe('значение расходится')
    expect(outside.status).toBe('вне пайплайна')
  })
})

describe('collectTodos', () => {
  test('находит комментарии в исходниках компонентов', () => {
    const todos = collectTodos(`${__dirname}/../../../src/components`)

    expect(todos.length).toBeGreaterThan(0)
    expect(todos.filter((todo) => todo.legacy.length === 0)).toHaveLength(0)
  })
})
