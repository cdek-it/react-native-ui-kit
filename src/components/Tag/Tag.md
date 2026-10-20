# Tag

Текстовая метка для статуса или категории с необязательной иконкой.

## Использование

```tsx
import { Tag } from '@cdek-it/react-native-ui-kit'

export function DeliveryStatus() {
  return <Tag text='Доставлено' severity='success' />
}
```

## Props

- `text` — обязательный текст метки
- `severity` — `primary | info | success | warning | danger | secondary`; по
  умолчанию `primary`. Определяет оформление и стандартную иконку. Устаревший
  `basic` поддерживается как алиас `primary`
- `rounded` — полное скругление углов; по умолчанию `false`
- `showIcon` — показывает иконку; по умолчанию `true`
- `Icon` — SVG типа `SvgSource`, переопределяющая стандартную иконку

Полный контракт — [TagProps](./Tag.tsx).

## Доступность

Текст масштабируется с системным шрифтом и остаётся однострочным; при нехватке
ширины сокращается многоточием.

Скринридер озвучивает видимый текст или заданный `accessibilityLabel` без
дублирования. Иконка декоративная.

Для обработки нажатия используйте интерактивного родителя. Доступное имя и роль
задавайте родителю, оставляя Tag без собственного `accessibilityLabel`.

## Макет

[Tag в Figma](https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=21-1238&m=dev)
