# InputGroupAddon

Дополнение InputGroup с текстом, SVG или действием

## Использование

```tsx
import { InputGroup, InputGroupAddon } from '@cdek-it/react-native-ui-kit'

export function SearchField({ onSearch }: { onSearch: () => void }) {
  return (
    <InputGroup
      placeholder='Номер заказа'
      rightAddon={<InputGroupAddon onPress={onSearch}>Найти</InputGroupAddon>}
    />
  )
}
```

Дополнение с `onPress` становится кнопкой; без обработчика используется как
декоративная часть поля.

## Props

- `children` — строка, число или собственная разметка. Текст оформляется
  автоматически.
- `Icon` — SVG-иконка; может использоваться вместе с `children`.
- `onPress` — обработчик действия.
- `disabled` — отключает дополнение. При `disabled` группы дополнение также
  отключено независимо от собственного значения.
- `accessibilityLabel` — имя кнопки; по умолчанию берётся из строкового или
  числового `children`.

Нативные PressableProps поддерживаются с ограничениями из
[InputGroupAddonProps](./InputGroupAddon.tsx).

## Доступность

Для кнопки только с SVG или собственной разметкой требуется
`accessibilityLabel`. Дополнение без действия отдельно не озвучивается. Значимое
для ввода содержимое, например единица измерения, может быть включено в
`accessibilityLabel` поля.
