# Button

Кнопка с текстом или иконкой и необязательным бейджем.

## Использование

```tsx
import { IconShoppingCart } from '@tabler/icons-react-native'
import { Badge, Button } from '@cdek-it/react-native-ui-kit'

export function OpenCartButton({ onPress }: { onPress: () => void }) {
  return (
    <Button
      Icon={IconShoppingCart}
      label='Корзина'
      badge={<Badge severity='danger'>3</Badge>}
      accessibilityLabel='Корзина. 3 товара'
      onPress={onPress}
    />
  )
}
```

## Props

### Основные

- `label` — текст кнопки. Обязателен для кнопки с текстом
- `variant` — оформление Button: `primary | secondary | tertiary | text | link`.
  По умолчанию `primary`
- `size` — `small | base | large | xlarge`. По умолчанию `base`
- `rounded` — полное скругление углов. По умолчанию `false`
- `loading` — показывает индикатор вместо иконки. По умолчанию `false`
- `badge` — готовый элемент `Badge` типа `ReactElement<BadgeProps>`. Размещается
  в верхнем правом углу, не меняет размер кнопки и остаётся видимым при
  `loading` и `disabled`
- `pressableRef` — ссылка на корневой нативный элемент кнопки

### Иконка

- `Icon` — SVG типа `SvgSource`. Необязателен рядом с текстом
- `iconOnly` — кнопка только с иконкой. Требует `Icon`, исключает `label` и
  `iconPosition`
- `iconPosition` — `prefix | postfix`. По умолчанию `prefix`

**При `iconOnly` обязательно задавайте `accessibilityLabel`**, чтобы у кнопки
было доступное имя.

### ButtonSeverity

Кнопка с семантическим цветом. Поддерживает общие props Button, включая `badge`.
Для оформления используйте:

- `severity` — обязательный `info | success | warning | danger`
- `appearance` — `filled | outlined | text`. По умолчанию `filled`

Иконку задавайте через `Icon`. Значение `severity` не подставляет её
автоматически.

```tsx
import { ButtonSeverity } from '@cdek-it/react-native-ui-kit'

export function DeleteButton() {
  return (
    <ButtonSeverity label='Удалить' severity='danger' appearance='outlined' />
  )
}
```

Полный контракт — [ButtonProps и ButtonSeverityProps](./types.ts).

## Макет

[Button в Figma](https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=160-5223)
