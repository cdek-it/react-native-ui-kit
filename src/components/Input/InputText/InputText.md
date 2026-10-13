# InputText

Текстовое поле с постоянной или плавающей подписью и дополнительным сообщением.

## Использование

```tsx
import { useState } from 'react'
import { InputText } from '@cdek-it/react-native-ui-kit'

export function NameField() {
  const [name, setName] = useState('')

  return <InputText label='Имя' value={name} onChangeText={setName} />
}
```

С `value` отображаемое значение определяется этим prop, а `onChangeText`
сообщает об изменении. Без `value` поле хранит значение самостоятельно;
`defaultValue` задаёт начальное значение.

### Режимы label

- `label` — постоянная подпись над полем.
- `floatLabel` — подпись внутри пустого поля, поднимающаяся при фокусе или
  вводе.
- `label` с `labelInfo` — нажимаемая строка с иконкой ⓘ; вызывает переданный
  `labelInfo.onPress`. С `floatLabel` действие недоступно.
- Без `label` и `floatLabel` — поле без подписи и отступа под неё.

`label` и `floatLabel` взаимоисключающие. С `floatLabel` отдельный `placeholder`
появляется при фокусе пустого поля; дублирование текста подписи не требуется.

```tsx
import { InputText } from '@cdek-it/react-native-ui-kit'

export function LabelModes({ onInfoPress }: { onInfoPress: () => void }) {
  return (
    <>
      <InputText label='Имя' />
      <InputText floatLabel='Телефон' placeholder='+7' required />
      <InputText label='Номер заказа' labelInfo={{ onPress: onInfoPress }} />
      <InputText placeholder='Поиск' />
    </>
  )
}
```

`onInfoPress` — обработчик приложения, в котором может быть реализован показ
подсказки. Название действия для скринридера задаётся через
`labelInfo.accessibilityLabel`; по умолчанию используется «Подробнее».

## Props

- `label` и `floatLabel` — взаимоисключающие необязательные подписи.
- `labelInfo` — действие для постоянного `label`.
- `caption` — дополнительное сообщение (`ReactNode`). Для статуса и иконки можно
  использовать [InputCaption](../InputCaption/InputCaption.md); строка и число
  оформляются автоматически, пустая строка не занимает место. Статус подписи
  задаётся независимо от `state` поля.
- `state` — `default | danger`; состояние валидации, по умолчанию `default`.
- `disabled` — отключает ввод и встроенные действия. `readOnly` запрещает ввод и
  очистку, сохраняя остальные действия. Приоритет у `disabled`.
- `required` — добавляет маркер обязательности и описание для скринридера.
- `size` — `small | base | large | xlarge`; по умолчанию `base`.
- `clearable` — включает очистку непустого редактируемого поля; по умолчанию
  `true`.
- `style` — стиль внешнего контейнера; `inputStyle` — стиль нативного ввода.
- `ref` — методы RN TextInput.
- `renderTextInput` — адаптер ввода. Полученные props и `inputRef` необходимы
  для подключения собственного TextInput.

Нативные props TextInput поддерживаются с ограничениями из
[InputTextProps](./types.ts). Для запрета редактирования используется
`readOnly`; `editable` исключён из API.

## Доступность

Имя поля определяется первым заданным значением: `aria-label`,
`accessibilityLabel`, `label`, `floatLabel`, `placeholder`. Обязательность и
ошибка дополняют имя.

Подпись без действия отдельно не озвучивается. При `labelInfo` вся строка
подписи доступна кнопкой «Текст label. Подробнее»; подпись сохраняется и в имени
поля. InputCaption озвучивается отдельно, `accessibilityHint` задаётся явно.

## Связанные компоненты

- [InputGroup](../InputGroup/InputGroup.md) — дополнения слева и справа.
- [Password](../Password/Password.md) — пароль с переключением видимости.
