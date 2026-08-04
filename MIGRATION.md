# Миграция на Unistyles V3

Стили переведены на `react-native-unistyles`. UI kit предоставляет провайдер и
хуки для настройки темы и шрифтов, а стили создаются через API `unistyles`.

## Изменения

### Настройка темы и шрифтов

Оберните приложение в `ThemeContextProvider`. Через `initialTheme` задаётся
начальная тема, через `fonts` — используемые семейства шрифтов:

```tsx
import {
  ThemeContextProvider,
  ThemeVariant,
} from '@cdek-it/react-native-ui-kit'

export const Root = () => (
  <ThemeContextProvider
    fonts={{ heading: 'MyFont', base: 'MySecondaryFont' }}
    initialTheme={ThemeVariant.Light}
  >
    <App />
  </ThemeContextProvider>
)
```

Провайдер не принимает пользовательские объекты тем. Он настраивает
зарегистрированные внутри UI kit темы `light` и `dark`.

### `useFonts`

Для получения настроенных шрифтов используйте экспортируемый UI kit хук:

```tsx
import { useFonts } from '@cdek-it/react-native-ui-kit'

const fonts = useFonts()
```

Или прямо в стилях через `StyleSheet.create(...)`:

```tsx
import { StyleSheet } from 'react-native-unistyles'

const styles = StyleSheet.create(({ fonts }) => ({
  title: { fontFamily: fonts.fontFamily.heading },
}))
```

### Чтение и переключение темы

Для чтения и переключения темы используйте публичные хуки UI kit:

```tsx
import {
  ThemeVariant,
  useChangeTheme,
  useTheme,
} from '@cdek-it/react-native-ui-kit'

const theme = useTheme()
const changeTheme = useChangeTheme()

changeTheme(ThemeVariant.Dark)
```

`ThemeContextProvider` не хранит тему и шрифты в React Context: `ThemeContext`
имеет значение `null`, а источником состояния остаётся Unistyles.

### `makeStyles` — removed

Используйте `StyleSheet.create(...)`:

```tsx
import { StyleSheet } from 'react-native-unistyles'

const styles = StyleSheet.create(({ semantic }) => ({
  container: {
    backgroundColor: semantic.colorScheme.color.bg.surface.default.default,
  },
}))
```

`makeStyles` использует `useUnistyles()`, что вызывает React-ререндеры при смене
темы. `StyleSheet.create(...)` — нативный путь, обновляет стили **без**
ререндеров.

UI kit не реэкспортирует `StyleSheet`, `useUnistyles`, `UnistylesRuntime` и
`withUnistyles`. Если они нужны приложению напрямую, импортируйте их из
`react-native-unistyles`.

## ESLint Правила для Unistyles

Три обязательных ESLint правила защищают от потери скрытого `unistyles` payload:

### ⛔ `unistyles/no-spread-unistyles` (error)

**Проблема**: Spread оператор теряет скрытый payload unistyles, что приводит к
потере темы и реактивности при её смене.

```typescript
// ❌ Неправильно — payload теряется
const myStyle = { ...styles.button }
const btn = { ...styles.button, marginTop: 10 }
Object.assign({}, styles.button)
const { button, text } = styles

// ✅ Правильно — payload сохранится
const myStyle = styles.button
style={[styles.button, { marginTop: 10 }]}
style={[styles.button, isActive && styles.buttonActive]}
```

### ⛔ `unistyles/no-unistyles-in-worklet` (error)

**Проблема**: Worklet функции (`useAnimatedStyle`, `runOnJS`, `withSpring`)
передаются в native код и не могут захватить весь unistyles объект. Нужно
вытащить примитивы.

```typescript
// ❌ Неправильно — styles целиком в worklet
const animStyle = useAnimatedStyle(() => ({ color: styles.text.color }))

// ✅ Правильно — примитив вытащен перед worklet
const color = styles.text.color
const animStyle = useAnimatedStyle(() => ({
  color, // Теперь это просто строка
}))
```

### ⚠️ `unistyles/no-spread-icon-styles` (warn)

Рекомендуется передавать явные props для Icon компонентов вместо spread.

```typescript
// ❌ Не рекомендуется
<Icon {...styles.icon} />

// ✅ Рекомендуется
const color = styles.icon.color
const width = styles.icon.width
<Icon width={width} height={24} color={color} />
```

### Почему это важно

`react-native-unistyles` добавляет скрытый payload в каждый объект из
`StyleSheet.create()`. Этот payload содержит информацию о:

- **Активной теме** (light/dark)
- **Responsive breakpoint** (размер экрана)
- **Unistyles runtime configuration**

Если потерять payload, нативная часть больше не сможет:

- Применить правильную тему
- Обновить стиль при смене темы/breakpoint
- Корректно интерпретировать значения

Подробнее:
[ESLint Rules for Unistyles](./configs/eslint/rules/unistyles/README.md)

## Babel конфигурация

Для получения нативного обновления стилей без React-ререндеров:

1. Используйте `StyleSheet.create(...)`.
2. Добавьте `autoProcessPaths` в Babel-конфиг вашего приложения.

Это нужно потому, что UI kit подключается из `node_modules`, а `unistyles` по
умолчанию не обрабатывает такие файлы.

Пример для приложения-потребителя:

```js
module.exports = function (api) {
  api.cache(true)

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'react-native-unistyles/plugin',
        { root: 'src', autoProcessPaths: ['@cdek-it/react-native-ui-kit'] },
      ],
    ],
  }
}
```

Если Babel plugin у вас уже настроен, достаточно добавить путь
`@cdek-it/react-native-ui-kit` в существующий `autoProcessPaths`.

Документация:

- [useUnistyles](https://www.unistyl.es/v3/references/use-unistyles/)
- [StyleSheet](https://www.unistyl.es/v3/references/stylesheet/)
- [Babel plugin](https://www.unistyl.es/v3/other/babel-plugin/)
