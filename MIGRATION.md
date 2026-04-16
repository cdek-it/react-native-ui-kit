# Миграция на Unistyles V3

Стили переведены на `react-native-unistyles`. `ThemeContextProvider` доступен
как внешний конфигуратор тем и шрифтов, но чтение темы и шрифтов теперь идет
через API `unistyles`.

## Изменения

### `ThemeContextProvider` — доступен

UI kit по-прежнему использует `react-native-unistyles` внутри, но для внешнего
потребителя снова доступен `ThemeContextProvider` как единая точка конфигурации
тем и шрифтов.

Если приложению нужны кастомные шрифты, настройте их через провайдер:

```tsx
import {
  ThemeContextProvider,
  ThemeVariant,
} from '@cdek-it/react-native-ui-kit'

export const Root = () => (
  <ThemeContextProvider
    fonts={{ primary: 'MyFont', secondary: 'MySecondaryFont' }}
    initialTheme={ThemeVariant.Light}
  >
    <App />
  </ThemeContextProvider>
)
```

Провайдер также принимает `lightTheme` и `darkTheme`, если нужно передать
полностью кастомные темы.

### `useFonts`

Используйте `useUnistyles`:

```tsx
import { useUnistyles } from '@cdek-it/react-native-ui-kit'

const { theme } = useUnistyles()
theme.fonts
```

Или прямо в стилях через `StyleSheet.create(...)`:

```tsx
const styles = StyleSheet.create(({ fonts }) => ({
  title: { fontFamily: fonts.primary },
}))
```

### `useTheme()` / `useChangeTheme()`

`ThemeContextProvider` больше не является источником `theme/fonts` через React
context. Он только конфигурирует `react-native-unistyles`.

- `useTheme()` читает `UnistylesRuntime.themeName`
- `useFonts()` читает `useUnistyles().theme.fonts`
- `ThemeContext` остается пустым и имеет значение `null`
- `useChangeTheme()` всегда вызывает `UnistylesRuntime.setTheme(...)`

### `makeStyles` — deprecated

Используйте `StyleSheet.create(...)`:

```tsx
import { StyleSheet } from '@cdek-it/react-native-ui-kit'

const styles = StyleSheet.create((theme) => ({
  container: { backgroundColor: theme.Button.Brand.buttonBg },
}))
```

`makeStyles` использует `useUnistyles()`, что вызывает React-ререндеры при смене
темы. `StyleSheet.create(...)` — нативный путь, обновляет стили **без**
ререндеров.

SDK реэкспортирует `StyleSheet`, `useUnistyles`, `UnistylesRuntime` и
`withUnistyles`, поэтому потребителям не нужно импортировать
`react-native-unistyles` напрямую.

### `useTheme()` — deprecated

```tsx
import { UnistylesRuntime, useUnistyles } from '@cdek-it/react-native-ui-kit'

const themeName = UnistylesRuntime.themeName // 'light' | 'dark'
```

Для реактивного поведения используйте `useUnistyles()`:

```tsx
const { rt } = useUnistyles()
rt.themeName
```

### `useChangeTheme()` — deprecated

```tsx
import { UnistylesRuntime } from '@cdek-it/react-native-ui-kit'

UnistylesRuntime.setTheme('dark')
```

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
