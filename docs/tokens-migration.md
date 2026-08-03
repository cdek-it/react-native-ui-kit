# Миграция компонентов на токены из `tokens.json`

Документ описывает работу в ветке `feature/tokens-migration-cleanup`,
ответвлённой от `feature/components-token-migration` (PR #56, коммит
`1b00580a`).

Файл не попадает в публикуемый пакет: `docs` перечислен в `.npmignore`, а
`package.json` публикует только `dist`.

## Зачем

PR #56 перевёл компоненты на неймспейс `components.*` и оставил в коде 157
комментариев `TODO(tokens-migration)` — мест, где компонент не получил нужного
токена либо получил значение, расходящееся с новой базой. Эта ветка разбирает
их: **157 → 2**.

Формат комментария:

```
// TODO(tokens-migration): reason=missing; legacy=<путь в коде>; value=<значение>
// TODO(tokens-migration): reason=value-mismatch; legacy=<путь>; value=<текущее>; target=<целевой токен>; targetValue=<целевое>
```

Важная особенность: при `reason=missing` поле `legacy` называет **не**
отсутствующий токен, а тот, что фактически используется. Прочтение «токена нет в
Figma» ошибочно — проверка резолвом показала, что все названные в TODO токены
существуют.

## Ключевая находка: две базы `rem`

Расхождения значений объясняются одной причиной. Legacy-ассеты
(`src/theme/assets/*.json`, лежат в репозитории с первого коммита, ноябрь 2025)
построены на `1rem = 14px`. `design-tokens/input/tokens.json` хранит значения в
`rem`, и генератор считает их при `1rem = 16px`.

Это подтверждается снимком Figma (`passport.md` из выгрузки дизайн-системы), где
те же ключи токенов имеют значения ровно в `0.875` раза меньше:

| Токен          | Figma (база 14) | `tokens.json` (база 16) |
| -------------- | --------------: | ----------------------: |
| `fontSize/300` |              14 |                      16 |
| `fontSize/500` |            17.5 |                      20 |
| `fontSize/650` |           26.25 |                      30 |

Решение по базе 16px принято владельцем дизайн-системы.

## Что изменилось

### Генератор токенов

`scripts/token-generator` теперь выводит пятый файл —
`src/theme/tokens/fonts.json` с группой `primitive.fonts` (`fontFamily`,
`fontSize`, `lineHeight`, `fontWeight`, `letterSpacing`). Значения
нормализованы: `rem` пересчитан в px.

Отсутствие `primitive.fonts` во входных токенах — ошибка генерации: тема без
шрифтов нерабочая.

Добавлен ревизор `yarn tokens:audit`: разбирает все `TODO(tokens-migration)` и
резолвит каждый `legacy`-путь в сгенерированных токенах и legacy-ассетах.
Показывает, существует ли токен и расходится ли значение. Первый прогон дал
ровно тот же состав из 157 позиций, что и ручная выгрузка, — парсер сверен.

### Тема

```ts
export const lightTheme: ThemeType = {
  semantic: lightSemanticTokens, // из tokens.json
  components: lightComponentTokens, // из tokens.json
  theme: { ...lightThemeAssets, InputSize, ModalSize, custom }, // legacy
  ...commonTheme, // primitive.fonts из tokens.json + legacy-остатки
}
```

Появился неймспейс `primitive.fonts`. Публичный `fonts: { primary, secondary }`
не изменился, но теперь собирается из токенов: `heading → primary`,
`base → secondary`. Хардкод `{ primary: 'TT Fellows', secondary: 'Noto Sans' }`
из `lightTheme.ts` и `darkTheme.ts` убран.

В `types.ts` добавлен тип `FontPrimitives`: JSON отдаёт `fontWeight` как
`number`, а `TextStyle` требует литеральный тип, поэтому приведение сделано в
одном месте.

### Типографика

| Свойство               |                   Было |                  Стало | Источник                                 |
| ---------------------- | ---------------------: | ---------------------: | ---------------------------------------- |
| `text-xs`              |                   10.5 |                     12 | `fontSize[100]`                          |
| `text-sm` (TT Fellows) |                  12.25 |                     12 | `fontSize[100]`                          |
| `text-sm` (Noto Sans)  |                  12.25 |                     14 | `fontSize[200]`                          |
| `text-base`            |                     14 |                     16 | `fontSize[300]`                          |
| `text-lg`              |                  15.75 |                     18 | `fontSize[400]`                          |
| `text-xl`              |                   17.5 |                     20 | `fontSize[500]`                          |
| `text-2xl`             |                     21 |                     24 | `fontSize[600]`                          |
| `text-3xl`             |                  26.25 |                     30 | `fontSize[650]`                          |
| `lineHeight`           | 15 / 18 / 20 / 21 / 24 | 18 / 20 / 22 / 24 / 28 | `lineHeight[300…600]`                    |
| `letterSpacing`        |           −0.25 / −0.5 |          −0.32 / −0.48 | `letterSpacing[200]`, `[400]`            |
| `fontWeight`           |        400 / 600 / 700 |                  те же | `fontWeight.regular / .demibold / .bold` |

`text-sm` разведён по шрифту не произвольно: карта `ds-typography.json`
фиксирует, что этот ключ резолвится в разные размеры для акцентного и базового
шрифтов. Затронуты `ButtonLabel`, `ToggleButton`, `SelectButtonItem`,
`useInputStyles`, `Title` (акцентный) и `Body`, `Caption`, `Subtitle`,
`Service`, `Anchor` (базовый).

`fontWeight` в снапшотах сменил тип со строки `"400"` на число `400` — React
Native принимает оба, рендер идентичен.

### Отступы, рамки, скругления

Переведены с legacy-ассетов на `semantic.dimension`:

| Было                                | Стало | Токен               |
| ----------------------------------- | ----: | ------------------- |
| `spacing.Gap['gap-1']` 3.5          |     4 | `space[100]`        |
| `spacing.Gap['gap-2']` 7            |     8 | `space[200]`        |
| `spacing.Padding['p-4']` 14         |    14 | `space[400]`        |
| `spacing.Padding['p-6']` 21         |    20 | `space[600]`        |
| `border.Width.border` 1             |     1 | `borderWidth[100]`  |
| `border.Width['border-3']` 3        |     4 | `borderWidth[300]`  |
| `border.Radius['rounded-full']` 100 |  1600 | `borderRadius.max`  |
| `border.Radius['rounded-xl']` 10.5  |    10 | `borderRadius[300]` |

### Компонентные токены

41 обращение переведено на токены, названные в поле `target` самих комментариев.
Из них изменяют внешний вид не из-за базы `rem`, а по существу:

| Компонент      | Свойство               |     Было | Стало |
| -------------- | ---------------------- | -------: | ----: |
| `Badge`        | `borderRadius`         |      100 |     8 |
| `ProgressBar`  | `borderRadius`         |      100 |    14 |
| `Skeleton`     | `borderRadius`         |        7 |    14 |
| `Accordion`    | `content.paddingRight` |        0 |    24 |
| `Message`      | `content.paddingLeft`  |     17.5 |    14 |
| `SelectButton` | `gap`                  | 7 / 10.5 |     4 |
| `ToggleButton` | `gap`, `paddingRight`  |     10.5 |    14 |

### Устранённые заимствования

`Chip`, `Tabs`, `InputGroupAddon`, `InputTextBase` и `MenuItem` брали
disabled-палитру у кнопки (`components.button.extend.disabled*`). В
`tokens.json` эти токены сами являются ссылками на роли:

```json
"disabledBackground": "{color.bg.neutral.weak.disabled}",
"disabledColor":      "{color.fg.muted}"
```

Генератор резолвит ссылку и записывает конкретный цвет, поэтому связь с ролью
терялась. Компоненты переведены на роли напрямую — теперь изменение кнопки не
затрагивает пять чужих компонентов. Значения не изменились.

Цвет вторичного текста (`typography.Color.Common['text-color-secondary']`, 5
мест) переведён на `semantic.colorScheme.color.fg.muted`. В светлой теме
значение то же (`#85888e`), в тёмной раньше было такое же, теперь `#a2a5a9` —
появилась тема-зависимость, которой не было.

### Узаконенные обращения

Часть комментариев помечала проблему, которой нет. Они сняты и заменены
обоснованием прямо в коде:

- **`Typography` (10)** — обращается к `semantic.color.fg.*` минуя слой
  `components`. Цвет текста и есть семантическая роль; компонента `typography` в
  `tokens.json` нет.
- **`InputOtp` (5)** — использует `components.inputtext.root.*`. Поле OTP должно
  выглядеть как обычное поле ввода, собственные токены `inputotp` описывают
  только отличия. Тот же приём в пресете PrimeUIX lara, где `inputotp` задаёт
  лишь `gap` и `width`.
- **`transparent` (3)** — в `Chip` и `MenuItem` литерал оставлен: у `chip.root`
  нет `borderColor`, у `menu.item` нет `background`, прозрачность не выражена
  semantic-токеном. У кнопки для варианта `link` токен нашёлся —
  `button.extend.extLink.background`.

### Размеры полей и последние цветовые роли

Высоты `InputSize` заданы целыми `rem`: `35 = 2.5rem`, `49 = 3.5rem`,
`56 = 4rem` при базе 14. При базе 16 это `40 / 56 / 64`, и все три значения есть
в `dimension.size`:

| Место                              |                Было | Стало | Токен                           |
| ---------------------------------- | ------------------: | ----: | ------------------------------- |
| `useInputStyles` `base`            |                  35 |    40 | `dimension.size[1100]`          |
| `useInputStyles` `large`           |                  49 |    56 | `size[1300]`                    |
| `useInputStyles` `xlarge`          |                  56 |    64 | `size[1400]`                    |
| `Tabs/TabItem` высота              | `badge.root.height` |    24 | `size[700]`                     |
| `ToggleButton` `paddingHorizontal` | `theme.Button.*` 14 |    14 | `togglebutton.root.paddingLeft` |

Те же высоты были продублированы числами в `ToggleButton` и `SelectButtonItem` —
переведены вместе с полями, иначе компоненты разъехались бы.

| Место                           | Было                    | Стало (light / dark) | Токен                          |
| ------------------------------- | ----------------------- | -------------------- | ------------------------------ |
| `ProgressSpinner`               | `global.Neutrals.White` | `#ffffff / #ffffff`  | `fg.on.fill.default`           |
| `Chip` граница success          | `#77f48a` фиксированный | `#1dc831 / #77f48a`  | `border.status.success.strong` |
| `SelectButton` disabled-граница | `#a2a5a9 / #56595f`     | `#cecfd2 / #56595f`  | `border.neutral.strong`        |

Для `SelectButton` точной пары в semantic не нашлось: тёмная тема совпадает,
светлая стала светлее.

## Осталось: 2 позиции

`SelectButtonItem.tsx`, строки 156 и 163 — цвет неактивного пункта берётся из
`semantic.colorScheme.color.fg.muted`. Токен рабочий и тема-зависимый; вопрос
только в том, заводить ли `components.selectbutton.colorScheme.root.color`.
Кодом не закрывается.

## Не тронуто намеренно

**`Timer`, `TimerFlip`** — используют
`typography.Color.Surface['text-surface-0']` (`#181a1f`). В semantic этот цвет
есть только как `fg.active` (светлая тема) и `fg.inverse.active` (тёмная), то
есть «активное состояние», а не «цвет текста». Соответствие по значению, но не
по смыслу.

**Сервисные цвета `Typography.Service` и `Anchor`** (7 мест) — legacy-палитра
построена на «600»-оттенках, а `semantic.fg.status.*.default` на «500». Например
`text-info` `#1e76cd` совпадает не с `status.info.default` (`#4496e8`), а с
`status.info.hover`. Выбор оттенка — решение дизайнера.

**`ListBase`** — `theme.Surface['surface-border']` и
`background.Common['bg-surface-ground-hover']`, по одному обращению.

**57 числовых литералов в стилях** — на них не было комментариев `TODO`, в
счётчик 157 они не входили. Реальный объём «не на токенах» больше, чем
показывает счётчик. Часть закрывается существующими токенами: `opacity: 0.6` в
семи местах (`Chip`, `RadioButton`, `MenuItem`, `ToggleButton`,
`InputGroupAddon` и др.) — это `semantic.effects.opacity[60]`, `opacity: 0.2` —
`[20]`.

**Размеры иконок на шрифтовой шкале.** `typography.Size` местами задавал не
шрифт, а размер иконки. Где в `tokens.json` есть `iconSize`, обращение
переведено на него; где нет — иконка осталась на `primitive.fonts.fontSize`.

## Структурный риск

Генератор покрывает `semantic`, `components` и `primitive.fonts`. Неймспейс
`theme.*` (`assets/themeLight.json`, `InputSize`, `ModalSize`, `custom`)
обновляется руками и с `tokens.json` не связан. Подмена входного файла его не
затронет, и расхождение обнаружится не при генерации, а глазами в интерфейсе —
тем же путём, каким возникли исходные 157 комментариев.

`src/theme/assets/DEPRECATED_TOKENS.md` фиксирует, что `theme.Button.*`,
`theme.Form.inputSwitch.*` и `theme.General.primaryColor` входят в публичный
`ThemeType`, поэтому их удаление — breaking change.

Отдельно: даже там, где UI Kit больше не использует legacy-неймспейс, он
остаётся в публичном `ThemeType` и доступен потребителям библиотеки —
`background`, `colors`, `border`, `effects`, `global`, `sizing`, `spacing`,
`typography`, `theme`, `custom`, `shadow`. Внутренняя миграция их не убирает.

## Проверка

```
yarn tokens:audit       # разбор оставшихся TODO
yarn tokens:validate    # типы генератора + актуальность сгенерированных токенов
yarn tsc --noEmit
yarn lint:check
yarn jest
```

На момент последнего коммита: `tsc` без ошибок, `eslint` без ошибок,
сгенерированные токены актуальны, 1712 тестов проходят.

**Снапшоты обновлены полностью** — метрики изменились почти везде. Отдельно
стоит знать: три набора (`Avatar`, `DialogHeader`, `ListBase`, 17 тестов) падали
ещё до начала этой работы, на исходном коммите ветки PR — снапшоты там не были
перегенерированы автором. При обновлении они перезаписаны вместе со всеми, то
есть тот долг не разобран, а зафиксирован.

Изменения затронули 50 файлов кода и 30 файлов снапшотов.
