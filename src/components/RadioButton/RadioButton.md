# RadioButton

Управляемая радиокнопка с необязательными label и caption для выбора одного
варианта.

## Использование

```tsx
import { useState } from 'react'
import { RadioButton } from '@cdek-it/react-native-ui-kit'

export function Example() {
  const [checked, setChecked] = useState(false)

  return (
    <RadioButton
      checked={checked}
      label='Доставка курьером'
      onPress={() => setChecked(true)}
    />
  )
}
```

## Props

- `checked` — выбран ли вариант. По умолчанию `false`. Отображение меняется
  только после обновления prop потребителем
- `onPress` — необязательный нативный обработчик нажатия. Потребитель выбирает
  вариант и снимает выбор с остальных. Повторное нажатие также вызывает
  обработчик, но компонент не переключает checked самостоятельно
- `disabled` — блокирует взаимодействие. По умолчанию `false`
- `danger` — оформление ошибки. По умолчанию `false`
- `label` — текст справа от круга. Без него отображается только круг
- `caption` — подпись под label. Без label не отображается

Пользовательский `style` объединяется с внутренним и поддерживает
callback-форму.

Полный контракт — [RadioButtonProps](./RadioButton.tsx).

Область нажатия расширена через `hitSlop` (по умолчанию 10) без изменения
размера компонента. Она ограничена границами родителя.

## Доступность

Вся строка — один элемент с ролью radio и состояниями checked и disabled. Label
задаёт доступное имя, caption — подсказку. Их можно переопределить через
`accessibilityLabel` и `accessibilityHint`.

Без label передайте доступное имя через `accessibilityLabel` или свяжите
радиокнопку с внешним текстом через `accessibilityLabelledBy` на Android. При
использовании accessibilityLabelledBy автоматическое имя из label не задаётся.
Родителю группы вариантов задайте `accessibilityRole='radiogroup'`. Ошибку
группы показывайте одним сообщением, передавая `danger` всем вариантам.

Текст переносится и масштабируется с системным шрифтом.

В составной карточке нажатие и доступность принадлежат внешнему Pressable.
Обёртка вложенного RadioButton блокирует его касания и скрывает от доступности;
для самого RadioButton задаётся `focusable={false}`. Пример —
[Overview](./stories/RadioButtonOverview.stories.tsx).

## Макет

[RadioButton в Figma](https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=17-13535)
