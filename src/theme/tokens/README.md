# Сгенерированные токены

`semantic` подключается к темам как `ThemeType.semantic`. `components` хранит
внутренние токены компонентов для `ThemeType.components`. `fonts.json` содержит
общие для цветовых схем токены из `primitive.fonts`, но пока не подключён к теме
и не экспортируется из библиотеки. Остальная часть `primitive` не записывается;
`colorScheme` содержит только выбранную ветку без вложенных `light` и `dark`.
Всё генерируется из `design-tokens/input/tokens.json` и не редактируется
вручную.

Подробности: [генератор токенов](../../../scripts/token-generator/README.md).

`focusRing` сохраняет структуру входных токенов. При `style: "none"` компонент
не применяет `width`, `color` и `offset` как outline-свойства, но может
использовать независимый `shadow` как `boxShadow`.

Для передачи easing в Reanimated используйте адаптер:

```ts
import { toEasing } from '@cdek-it/react-native-ui-kit'

const easing = toEasing(theme.semantic.effects.transition.easing.standard)
```
