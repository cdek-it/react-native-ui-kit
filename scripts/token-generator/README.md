# Генератор токенов

Генератор преобразует входные токены из Figma в JSON для React Native.

## Обновление токенов

1. Обновить `design-tokens/input/tokens.json`.
2. Запустить `yarn tokens:generate`.
3. Проверить изменения в `src/theme/tokens`.
4. Запустить `yarn tokens:validate`.
5. Закоммитить входные и сгенерированные токены вместе.

`tokens:generate` записывает и форматирует файлы. `tokens:validate` ничего не
меняет: проверяет TypeScript генератора и актуальность сгенерированных токенов.

## Использование в компонентах

Внутри UI Kit используются component-токены:

```ts
StyleSheet.create(({ components }) => ({
  header: {
    backgroundColor: components.accordion.colorScheme.header.background,
  },
}))
```

Semantic-токены доступны потребителям библиотеки в `semantic`. Unistyles
подставляет соответствующие light- или dark-токены при переключении темы.

## Результат генерации

Из `design-tokens/input/tokens.json` создаются четыре файла:

```text
src/theme/tokens
├── semantic
│   ├── light.json
│   └── dark.json
└── components
    ├── light.json
    └── dark.json
```

Для каждого выходного файла выбирается соответствующая ветка `colorScheme.light`
или `colorScheme.dark`. Ключ `colorScheme` сохраняется, а уровень `light`/`dark`
удаляется:

```text
semantic.colorScheme.light.color
→ semantic/light.json: colorScheme.color

components.button.colorScheme.light.outlined
→ components/light.json: button.colorScheme.outlined
```

`primitive` нужен только для подстановки ссылок и не записывается в результат.
Light- и dark-файлы должны иметь одинаковую структуру и типы значений.

## Преобразование значений

Ссылки разрешаются до нормализации. Поддерживаются ссылки на всё значение и
вставки внутри строк:

```text
"{dimension.space.400}" -> "0.875rem" -> 14

"inset 0 0 0 {dimension.focusRing.width} {colors.solid.green.200}"
-> "inset 0 0 0 4px #d4fedc"
```

```text
"1.5rem"  -> 24
"150ms"   -> 150
"0"       -> 0
```

CSS shorthand из 2–4 значений раскрывается в поля React Native:

```text
padding: "8 14"
-> paddingTop: 8
-> paddingRight: 14
-> paddingBottom: 8
-> paddingLeft: 14
```

Генерация завершается с ошибкой при отсутствующей или циклической ссылке,
неподдерживаемом shorthand, оставшихся `rem`/`ms`, `NaN` или `Infinity`.

## Автоматические проверки

`yarn tokens:validate` запускается при сборке, в CI и перед push. Если
сгенерированные файлы устарели, нужно выполнить `yarn tokens:generate` и
проверить diff.

## Устройство генератора

Для изменения генератора: `core/compiler.ts` собирает темы, `core/resolution.ts`
разрешает ссылки, `core/normalization.ts` преобразует значения,
`core/validation.ts` проверяет результат. CLI и запись файлов находятся в
`build.ts` и `io.ts`.
