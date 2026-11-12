# Сгенерированные токены

В `ThemeType`, `lightTheme` и `darkTheme` входят выбранный
`semantic.colorScheme`, общие `semantic.dimension`, `semantic.effects`, `fonts`
и соответствующие теме `components`. Отдельно из пакета экспортируются только
общие `semanticTokens`; карты component- и font-токенов остаются внутренними.
Всё генерируется из `design-tokens/input/tokens.json` и не редактируется
вручную.

Подробности: [генератор токенов](../../../scripts/token-generator/README.md).

`focusRing` сохраняет структуру входных токенов. При `style: "none"` компонент
не применяет `width`, `color` и `offset` как outline-свойства, но может
использовать независимый `shadow` как `boxShadow`.

Для передачи easing в Reanimated используйте адаптер:

```ts
import { semanticTokens, toEasing } from '@cdek-it/react-native-ui-kit'

const easing = toEasing(semanticTokens.effects.transition.easing.standard)
```
