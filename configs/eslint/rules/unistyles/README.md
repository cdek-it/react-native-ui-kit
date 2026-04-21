# ESLint Rules for Unistyles

Custom ESLint rules для защиты от потери скрытого `unistyles_*` payload при
работе со стилями из `StyleSheet.create()`.

## Проблема

`react-native-unistyles` добавляет скрытый payload в каждый объект из
`StyleSheet.create()`. Этот payload содержит информацию о:

- **Теме** (light/dark и т.д.)
- **Responsive breakpoint** (текущий размер экрана)
- **Unistyles runtime configuration**

Когда ты распаковываешь объект через spread или деструктуризируешь его, этот
payload **теряется**. Нативная часть больше не может:

- Применить правильную тему
- Обновить стиль при смене темы/breakpoint
- Корректно интерпретировать значения

## Правила

### 1. `unistyles/no-spread-unistyles` (error)

**Запрещает** распаковывать объекты из `StyleSheet.create()` через spread
оператор.

#### ❌ Неправильно

```typescript
const styles = StyleSheet.create({ button: { padding: 12 } })

// Spread теряет скрытый payload
const myStyle = { ...styles.button }
const btn = { ...styles.button, marginTop: 10 }

// Object.assign тоже теряет payload
Object.assign({}, styles.button)
```

#### ✅ Правильно

```typescript
const styles = StyleSheet.create({ button: { padding: 12 } })

// Передавай массив стилей (самый безопасный способ)
style={[styles.button, extraStyle]}

// Или используй напрямую
style={styles.button}

// Для динамических стилей — массив
style={[
  styles.button,
  isActive && styles.buttonActive,
]}
```

---

### 2. `unistyles/no-unistyles-in-worklet` (error)

**Запрещает** захватывать переменную `styles` в worklet closures
(`useAnimatedStyle`, `runOnJS` и т.д.).

Причина: worklet функции передаются в native код, и весь unistyles объект
потеряет скрытый payload при этой передаче.

#### ❌ Неправильно

```typescript
const styles = useStyles()

// ❌ styles захвачена целиком в worklet
const animStyle = useAnimatedStyle(() => ({ color: styles.text.color }))

// ❌ styles передана в worklet
withSpring(styles.animConfig)

// ❌ styles в runOnJS
runOnJS(() => console.log(styles.debug))
```

#### ✅ Правильно

```typescript
const styles = useStyles()

// ✅ Вытащи примитив ДО worklet
const color = styles.text.color as string
const animConfig = styles.animConfig

const animStyle = useAnimatedStyle(() => ({
  color, // Теперь это просто строка
}))

withSpring(animConfig) // Примитив передан

// Если нужны разные типы — распакуй явно
const { width, height } = styles.icon
runOnJS(() => {
  console.log(width, height) // Примитивы
})
```

---

### 3. `unistyles/no-spread-icon-styles` (warn)

**Предупреждает** о spread unistyles объектов при передаче в Icon компоненты.

Лучше передавать явные props для понимаемости и безопасности.

#### ❌ Не рекомендуется

```typescript
const styles = StyleSheet.create({
  icon: { width: 24, height: 24, color: 'red' }
})

// Spread скрывает, какие props передаются
<Icon {...styles.icon} />
<TablerIcon {...iconStyles} />
```

#### ✅ Рекомендуется

```typescript
const styles = StyleSheet.create({
  icon: { width: 24, height: 24, color: 'red' }
})

// Явные props — лучше видна структура
<Icon
  width={24}
  height={24}
  color="red"
/>

// Или если нужны переменные
const color = styles.icon.color
const width = styles.icon.width
<Icon width={width} height={24} color={color} />
```

---

## Пример потери payload

```typescript
const styles = StyleSheet.create({
  text: useColorScheme() === 'dark'
    ? { color: '#fff' }
    : { color: '#000' }
})

// ❌ Потеря payload при spread
const myStyle = { ...styles.text } // payload потерян, цвет не обновится при смене темы

// ✅ Payload сохранён
const myStyle = styles.text // нет payload потерь
style={styles.text} // payload сохранён
```

---

## Как исправить существующий код

### 1. Spread в объектах → используй массив

```typescript
// ❌ Было
{ ...styles.button, marginTop: 10 }

// ✅ Стало
[styles.button, { marginTop: 10 }]
```

### 2. Worklets → вытащи примитив перед worklet

```typescript
// ❌ Было
useAnimatedStyle(() => ({ color: styles.text.color }))

// ✅ Стало
const color = styles.text.color
useAnimatedStyle(() => ({ color }))
```

### 3. Icon spreads → явные props

```typescript
// ❌ Было
<Icon {...styles.icon} />

// ✅ Стало
<Icon width={24} height={24} color="#000" />
```

---

## Подключение в проекте-потребителе

Правила экспортируются из пакета через subpath `@cdek-it/react-native-ui-kit/eslint`.
Требуется ESLint ≥ 9 (flat config).

### 1. Подключи плагин в `eslint.config.mjs`

```js
// eslint.config.mjs
import { unistylesPlugin } from '@cdek-it/react-native-ui-kit/eslint'

export default [
  {
    files: ['src/**/*.{ts,tsx}'],  // ← укажи свои пути
    plugins: { unistyles: unistylesPlugin },
    rules: {
      'unistyles/no-spread-unistyles': 'error',
      'unistyles/no-unistyles-in-worklet': 'error',
      'unistyles/no-spread-icon-styles': 'warn',
    },
  },
]
```

Если уже используешь `defineConfig`:

```js
import { defineConfig } from 'eslint/config'
import { unistylesPlugin } from '@cdek-it/react-native-ui-kit/eslint'

export default defineConfig([
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { unistyles: unistylesPlugin },
    rules: {
      'unistyles/no-spread-unistyles': 'error',
      'unistyles/no-unistyles-in-worklet': 'error',
      'unistyles/no-spread-icon-styles': 'warn',
    },
  },
])
```

### 2. Проверь, что всё работает

```bash
npx eslint src/
```

---

## Использование (внутри репозитория UI kit)

Правила автоматически включены в конфиг ESLint для всех файлов в
`src/**/*.{ts,tsx}`.

### Конфигурация

```typescript
rules: {
  'unistyles/no-spread-unistyles': 'error',      // ⛔ Критичная ошибка
  'unistyles/no-unistyles-in-worklet': 'error',  // ⛔ Критичная ошибка
  'unistyles/no-spread-icon-styles': 'warn',     // ⚠️ Рекомендация
}
```

### Проверить нарушения

```bash
npm run lint:check
```

### Автоматическое исправление

```bash
npm run lint:fix
```

---

## Как это работает

Правила используют **ESLint AST (Abstract Syntax Tree)** для отслеживания:

1. **SpreadElement** — ловит `{ ...styles.foo }`
2. **CallExpression** — ловит `Object.assign({}, styles.foo)`
3. **Identifier / MemberExpression** — проверяет захват `styles` в worklet
   closures
4. **JSXSpreadAttribute** — ловит `{...styles}` в JSX

Это гарантирует, что скрытый `unistyles_*` payload не будет случайно потерян при
refactoring или во время разработки.

---

## Структура

```
configs/eslint/rules/unistyles/
├── index.ts          - Все правила и конфиг
├── types.ts          - Типы для AST узлов
└── README.md         - Эта документация
```

---

## Ссылки

- [Unistyles Documentation](https://www.unistyl.es)
- [ESLint Custom Rules Guide](https://eslint.org/docs/developer-guide/working-with-rules)
- [Unistyles with Reanimated](https://www.unistyl.es/v3/guides/reanimated/)
