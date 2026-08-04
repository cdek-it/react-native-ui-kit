# Сгенерированные токены

В `ThemeType.semantic` подключается только выбранный `colorScheme`. Общие
`dimension` и `effects` экспортируются как статический `semanticTokens`, поэтому
не участвуют в переключении темы. `components` хранит внутренние токены
компонентов и не входит в темы или публичные экспорты. `fonts.json` содержит
общие для цветовых схем токены из `primitive.fonts`, но пока не подключён к теме
и не экспортируется из библиотеки. Всё генерируется из
`design-tokens/input/tokens.json` и не редактируется вручную.

Подробности: [генератор токенов](../../../scripts/token-generator/README.md).

`focusRing` сохраняет структуру входных токенов. При `style: "none"` компонент
не применяет `width`, `color` и `offset` как outline-свойства, но может
использовать независимый `shadow` как `boxShadow`.

Для передачи easing в Reanimated используйте адаптер:

```ts
import { semanticTokens, toEasing } from '@cdek-it/react-native-ui-kit'

const easing = toEasing(semanticTokens.effects.transition.easing.standard)
```
