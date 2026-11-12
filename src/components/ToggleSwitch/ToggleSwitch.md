# ToggleSwitch

Управляемый переключатель с необязательными `label` и `caption`.

## Использование

```tsx
import { useState } from 'react'
import { ToggleSwitch } from '@cdek-it/react-native-ui-kit'

export function Notifications() {
  const [checked, setChecked] = useState(false)

  return (
    <ToggleSwitch
      checked={checked}
      onCheckedChange={setChecked}
      label='Уведомления'
      caption='Сообщать об изменении статуса заказа'
    />
  )
}
```

## Props

- `checked` — обязательное boolean-значение. Состояние меняется после обновления
  `checked` потребителем.
- `onCheckedChange` — необязательный callback, передающий следующее значение
  после нажатия.
- `label` — строка справа от переключателя. Без `label` отображается только
  переключатель.
- `caption` — строка под `label`. Без `label` не отображается.
- `disabled` — блокирует нажатия. По умолчанию `false`.
- `danger` — выделяет переключатель как ошибочный. По умолчанию `false`.

Пользовательский `style` объединяется с внутренним, включая callback-форму.
Нативные обработчики нажатия вызываются вместе с `onCheckedChange`.

Полный контракт — [ToggleSwitchProps](./types.ts).

## Доступность

Вся строка — один элемент с ролью `switch` и состояниями `checked` и `disabled`.
`label` задаёт доступное имя, `caption` — подсказку. Их можно переопределить
нативными атрибутами доступности. Без `label` рекомендуется передать
`accessibilityLabel` или связать компонент с внешним текстом через
`accessibilityLabelledBy` на Android. Атрибуты доступного имени необязательны.
Ожидание запроса можно обозначить через
`accessibilityState={{ busy: loading }}`.

## Макет

[ToggleSwitch в Figma](https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=19-13673&m=dev)
