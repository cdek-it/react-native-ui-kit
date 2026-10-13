# InputGroup

Поле ввода с дополнениями слева и справа: единицами измерения, SVG или
действиями.

## Использование

```tsx
import { InputGroup } from '@cdek-it/react-native-ui-kit'

export function PriceField() {
  return <InputGroup label='Стоимость' rightAddon='₽' />
}
```

Строки и числа оформляются автоматически. Для SVG и действий доступен
[InputGroupAddon](./InputGroupAddon.md):

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

Дополнения, `label`, `floatLabel` и `caption` необязательны. `onSearch` —
обработчик приложения.

## Props

- `leftAddon` — дополнение слева (`ReactNode`).
- `rightAddon` — дополнение справа (`ReactNode`).

Остальные props, обработчики и `ref` — как у
[InputText](../InputText/InputText.md).

Полный контракт — [InputGroupProps](./types.ts).

## Поведение дополнений

InputGroupAddon наследует оформление и `disabled` группы. Для собственной
интерактивной ноды `disabled` задаётся явно тем же значением, что у группы.
`readOnly` запрещает редактирование поля и сохраняет действия дополнений.
