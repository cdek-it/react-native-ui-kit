# InputGroup

Поле ввода с дополнениями слева и справа: единицами измерения, SVG или
действиями.

## Использование

```tsx
import { InputGroup, InputGroupAddon } from '@cdek-it/react-native-ui-kit'

export function OrderField({ onSearch }: { onSearch: () => void }) {
  return (
    <InputGroup
      placeholder='Номер заказа'
      leftAddon='№'
      rightAddon={<InputGroupAddon onPress={onSearch}>Найти</InputGroupAddon>}
    />
  )
}
```

Строки и числа оформляются автоматически. Для SVG и действий доступен
[InputGroupAddon](./InputGroupAddon.md). В примере `onSearch` — обработчик
приложения.

## Props

- `leftAddon` и `rightAddon` — необязательные дополнения слева и справа
  (`ReactNode`).

Остальные props, обработчики и `ref` — как у
[InputText](../InputText/InputText.md).

Режимы подписей — в разделе
[«Режимы label»](../InputText/InputText.md#режимы-label).

Полный контракт — [InputGroupProps](./types.ts).

## Поведение дополнений

InputGroupAddon наследует оформление и `disabled` группы. Для собственной
интерактивной ноды `disabled` задаётся явно тем же значением, что у группы.
`readOnly` запрещает редактирование поля и сохраняет действия дополнений.
