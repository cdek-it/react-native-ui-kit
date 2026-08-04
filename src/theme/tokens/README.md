# Сгенерированные токены

В публичный `ThemeType.semantic` подключается только выбранный `colorScheme`.
Общие `dimension`, `effects` и `fonts` добавляются во внутреннюю тему Unistyles и
не зависят от цветовой схемы. В неё же добавляются соответствующие светлой или
тёмной теме `components`. В публичные темы и экспорты component- и font-токены
не входят. Всё генерируется из `design-tokens/input/tokens.json` и не
редактируется вручную.

Подробности: [генератор токенов](../../../scripts/token-generator/README.md).

`focusRing` сохраняет структуру входных токенов. При `style: "none"` компонент
не применяет `width`, `color` и `offset` как outline-свойства, но может
использовать независимый `shadow` как `boxShadow`.

Для передачи easing в Reanimated используйте адаптер:

```ts
import { semanticTokens, toEasing } from '@cdek-it/react-native-ui-kit'

const easing = toEasing(semanticTokens.effects.transition.easing.standard)
```
