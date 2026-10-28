# InputCaption

Дополнительное сообщение с визуальным статусом

## Использование

```tsx
import { InputCaption, InputText } from '@cdek-it/react-native-ui-kit'

export function AddressField() {
  return (
    <InputText
      label='Адрес'
      caption={
        <InputCaption variant='info' showIcon>
          Улица, дом и квартира
        </InputCaption>
      }
    />
  )
}
```

В `caption` поля строка или число автоматически оформляются как InputCaption.
Для статуса или иконки можно передать компонент явно. Его `variant` задаётся
независимо от `state` поля.

## Props

- `children` — содержимое сообщения.
- `variant` — `base | info | success | warning | danger`; по умолчанию `base`.
  Определяет оформление и стандартную иконку.
- `showIcon` — показывает иконку; по умолчанию `false`.
- `Icon` — SVG, переопределяющий стандартную иконку. Для показа нужен
  `showIcon`.
- `style` — стиль контейнера сообщения.

Полный контракт — [InputCaptionProps](./InputCaption.tsx).

## Доступность

Сообщение озвучивается отдельно от поля; SVG декоративна. Подсказка поля
задаётся через `accessibilityHint` у [InputText](../InputText/InputText.md);
содержимое InputCaption автоматически в неё не переносится.
