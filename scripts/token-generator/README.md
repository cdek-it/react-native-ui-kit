# Генератор токенов

Генератор преобразует входные токены из Figma в JSON для React Native.

## Обновление токенов

1. Обновить `design-tokens/input/tokens.json`.
2. Запустить `yarn tokens:generate`.
3. Проверить изменения в `src/theme/tokens`.
4. Запустить `yarn tokens:validate`.
5. Закоммитить входные и сгенерированные токены вместе.

`tokens:generate` нормализует значения, удаляет лишние JSON и записывает
результат. `tokens:validate` ничего не меняет: проверяет TypeScript генератора и
актуальность сгенерированных токенов.

## Использование токенов

Component-токены предназначены только для реализации компонентов UI Kit. Они не
входят в темы и публичные экспорты библиотеки.

В `semantic` темы находится только `colorScheme`: Unistyles подставляет
соответствующие light- или dark-токены при переключении темы. Не зависящие от
темы `dimension` и `effects` доступны в статическом `semanticTokens`.

## Результат генерации

Из `design-tokens/input/tokens.json` создаются семь файлов:

```text
src/theme/tokens
├── fonts.json
├── semantic
│   ├── colorScheme
│   │   ├── light.json
│   │   └── dark.json
│   ├── dimensions.json
│   └── effects.json
└── components
    ├── light.json
    └── dark.json
```

Для `semantic/colorScheme` и component-файлов выбирается соответствующая ветка
`colorScheme.light` или `colorScheme.dark`, а уровень `light`/`dark` удаляется.
Semantic-файл подключается в тему как `semantic.colorScheme`; в component-файлах
ключ `colorScheme` сохраняется:

```text
semantic.colorScheme.light.color
→ semantic/colorScheme/light.json: color

components.button.colorScheme.light.outlined
→ components/light.json: button.colorScheme.outlined
```

`semantic.dimension` записывается в `semantic/dimensions.json`, а
`semantic.effects` — в `semantic/effects.json`. Эти секции генерируются один раз
и не входят в тему. Если их итоговые значения зависят от `colorScheme`,
генератор завершится с ошибкой.

`fonts.json` собирается из `primitive.fonts`, нормализуется по общим правилам и
не разделяется по цветовым схемам. Пока файл не экспортируется из библиотеки.

Остальная часть `primitive` нужна только для подстановки ссылок и не
записывается в результат. Light- и dark-файлы должны иметь одинаковую структуру
и типы значений.

## Преобразование значений

Ссылки разрешаются до нормализации. Поддерживаются ссылки на всё значение и
вставки внутри поддерживаемых shorthand и `boxShadow`:

```text
"{dimension.space.400}" -> "0.875rem" -> 14
```

```text
"1.5rem"  -> 24
"4px"     -> 4
"150ms"   -> 150
"0.4"     -> 0.4
"0"       -> 0
```

Числовые строки преобразуются в числа, включая `fontWeight`.

Animation duration преобразуется из `ms` в число. Easing записывается как
коэффициенты для `Easing.bezier`:

```text
"linear" -> { x1: 0, y1: 0, x2: 1, y2: 1 }
"cubic-bezier(0.2, 0, 0, 1)" -> { x1: 0.2, y1: 0, x2: 0, y2: 1 }
```

Коэффициенты `x1` и `x2` должны находиться в диапазоне от `0` до `1`.

CSS shorthand из 2–4 значений раскрывается в поля React Native:

```text
padding: "8px 14px"
-> paddingTop: 8
-> paddingRight: 14
-> paddingBottom: 8
-> paddingLeft: 14
```

Для `borderRadius` одинаковые значения сворачиваются в число. Разные значения
сохраняются в объекте в порядке углов CSS:

```text
borderRadius: "0 0 0 0"
-> borderRadius: 0

borderRadius: "4 8 12 16"
-> borderRadius: { left: 16, top: 4, right: 8, bottom: 12 }
```

Значения `boxShadow` сохраняются строками. Размеры внутри строки записываются в
`px`, поэтому ссылка на `0.25rem` превращается в `4px`. `boxShadow` требует New
Architecture. На Android обычные тени поддерживаются с API 28, `inset` — с
API 29. Fallback для более ранних версий намеренно не предусмотрен.

`focusRing` сохраняет исходную структуру. Его размеры нормализуются, а `shadow`
обрабатывается по правилам `boxShadow`. Значение `style: "none"` отключает
только применение `width`, `color` и `offset` как outline-свойств: генератор не
зануляет эти токены. `shadow` остаётся независимым и может использоваться как
`boxShadow`.

Генерация завершается с ошибкой при отсутствующей или циклической ссылке,
неподдерживаемом shorthand, непреобразованных числовых значениях и единицах,
составных `rem`/`px` вне `boxShadow`, `NaN` или `Infinity`.

## Автоматические проверки

`yarn tokens:check` только проверяет файлы и отдельно показывает отсутствующие,
изменённые и лишние JSON. `yarn tokens:validate` дополнительно проверяет
TypeScript генератора. Если проверка не прошла, нужно выполнить
`yarn tokens:generate` и проверить diff.

## Устройство генератора

Для изменения генератора: `core/compiler.ts` собирает темы, `core/resolution.ts`
разрешает ссылки, `core/normalization.ts` преобразует значения,
`core/validation.ts` проверяет результат. CLI и запись файлов находятся в
`build.ts` и `io.ts`.
