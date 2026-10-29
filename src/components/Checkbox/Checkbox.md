# Checkbox

Управляемый чекбокс с необязательными label и caption для множественного выбора.

## Использование

```tsx
import { useState } from 'react'
import { Checkbox } from '@cdek-it/react-native-ui-kit'

export function Notifications() {
  const [checked, setChecked] = useState(false)

  return (
    <Checkbox
      caption='Сообщать об изменении статуса заказа'
      checked={checked}
      label='Получать уведомления'
      onCheckedChange={setChecked}
    />
  )
}
```

## Props

- `checked` — выбранное значение. По умолчанию `false`. Отображение меняется
  только после обновления prop потребителем
- `indeterminate` — частично выбранное значение. По умолчанию `false`.
  Переопределяет отображение checked и показывается как минус. На вычисление
  следующего checked не влияет
- `onCheckedChange` — необязательный callback со следующим значением checked:
  `!checked`. Потребитель обновляет checked и управляет indeterminate
  самостоятельно
- `disabled` — блокирует взаимодействие. По умолчанию `false`
- `danger` — оформление ошибки. По умолчанию `false`
- `label` — текст справа от квадрата. Без него отображается только квадрат
- `caption` — подпись под label. Без label не отображается

Нативный `onPress` вызывается после onCheckedChange. Пользовательский `style`
объединяется с внутренним и поддерживает callback-форму.

Полный контракт — [CheckboxProps](./Checkbox.tsx).

Область нажатия расширена через `hitSlop` (по умолчанию 10) без изменения
размера компонента. Она ограничена границами родителя.

## Доступность

Вся строка — один элемент с ролью checkbox и состояниями checked/mixed и
disabled. Label задаёт доступное имя, caption — подсказку. Их можно
переопределить через `accessibilityLabel` и `accessibilityHint`.

Без label передайте доступное имя через `accessibilityLabel` или свяжите чекбокс
с внешним текстом через `accessibilityLabelledBy` на Android. При использовании
accessibilityLabelledBy автоматическое имя из label не задаётся.

Текст переносится и масштабируется с системным шрифтом.

В составной карточке нажатие и доступность принадлежат внешнему Pressable.
Обёртка вложенного Checkbox блокирует его касания и скрывает от доступности; для
самого Checkbox задаётся `focusable={false}`. Пример —
[Overview](./stories/CheckboxOverview.stories.tsx).

## Макет

[Checkbox в Figma](https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=16-13529)
