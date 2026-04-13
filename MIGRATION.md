# Миграция на Unistyles V3

Стили переведены на `react-native-unistyles`. Удален собственный `React Context`
и провайдер.

## Изменения

### `ThemeContextProvider` — удалён

Темы регистрируются автоматически. Обёртка больше не нужна.

### `useFonts` — deprecated

Используйте `useUnistyles`:

```tsx
import { useUnistyles } from '@cdek-it/react-native-ui-kit'

const { theme } = useUnistyles()
theme.fonts
```

Или прямо в стилях через `StyleSheet.create(...)`.

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

## Babel конфигурация

Для получения нативного обновления стилей без React-ререндеров:

1. Используйте `StyleSheet.create(...)`.
2. Добавьте `autoProcessPaths` в Babel-конфиг вашего приложения.

Документация:

- [useUnistyles](https://www.unistyl.es/v3/references/use-unistyles/)
- [StyleSheet](https://www.unistyl.es/v3/references/stylesheet/)
- [Babel plugin](https://www.unistyl.es/v3/other/babel-plugin/)
