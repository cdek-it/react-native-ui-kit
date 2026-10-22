# InputText

Текстовое поле с постоянной или плавающей подписью и дополнительным сообщением.

## Использование

```tsx
import { useState } from 'react'
import { InputText } from '@cdek-it/react-native-ui-kit'

export function InputFields({ showInfo }: { showInfo: () => void }) {
  const [phone, setPhone] = useState('')

  return (
    <>
      <InputText
        floatLabel='Телефон'
        placeholder='+7'
        value={phone}
        onChangeText={setPhone}
      />
      <InputText label='Номер заказа' labelInfo={{ onPress: showInfo }} />
    </>
  )
}
```

`showInfo` — обработчик приложения, например для показа подсказки.

С `value` обновляйте значение через `onChangeText`. Без `value` поле хранит его
самостоятельно, а `defaultValue` задаёт начальное значение.

## Режимы label

- `label` — постоянная подпись над полем.
- `floatLabel` — подпись внутри поля, поднимающаяся при фокусе или наличии
  текста.
- `labelInfo` — делает постоянный `label` кнопкой с иконкой ⓘ и обработчиком
  `labelInfo.onPress`. С `floatLabel` недоступен.

`label` и `floatLabel` взаимоисключающие и необязательные. Без них место под
подпись не резервируется. С `floatLabel` отдельный `placeholder` появляется при
фокусе пустого поля. Дублировать в нём текст подписи не требуется.

## Props

- `caption` — дополнительное сообщение (`ReactNode`). Для статуса и иконки можно
  использовать [InputCaption](../InputCaption/InputCaption.md). Строка и число
  оформляются автоматически, пустая строка не занимает место. Статус подписи
  задаётся независимо от `state` поля.
- `state` — `default | danger`, по умолчанию `default`. Ошибка не запрещает
  ввод.
- `disabled` — отключает ввод и встроенные действия. `readOnly` запрещает ввод и
  очистку, сохраняя остальные действия. Приоритет у `disabled`.
- `required` — добавляет маркер обязательности и описание для скринридера.
- `size` — `small | base | large | xlarge`, по умолчанию `base`. С `floatLabel`
  высота и типографика не зависят от `size` согласно макетам.
- `clearable` — включает очистку непустого редактируемого поля, по умолчанию
  `true`.
- `inputStyle` — стиль нативного ввода. `style` применяется к внешнему
  контейнеру.
- `ref` — методы RN TextInput.
- `renderTextInput` — адаптер ввода. Полученные props и `inputRef` необходимы
  для подключения собственного TextInput.

Нативные props TextInput поддерживаются с ограничениями из
[InputTextProps](./types.ts). Для запрета редактирования используется
`readOnly`, а `editable` исключён из API.

## Доступность

Имя поля определяется первым заданным значением: `aria-label`,
`accessibilityLabel`, `label`, `floatLabel`, `placeholder`. Обязательность и
ошибка дополняют имя.

Подпись без действия отдельно не озвучивается. При `labelInfo` она доступна
кнопкой «Текст label. Подробнее» и сохраняется в имени поля. Название действия
«Подробнее» меняется через `labelInfo.accessibilityLabel`.

InputCaption озвучивается отдельно, `accessibilityHint` задаётся явно.

Увеличенный системный шрифт может увеличивать высоту поля.

## Связанные компоненты

- [InputGroup](../InputGroup/InputGroup.md) — дополнения слева и справа.
- [Password](../Password/Password.md) — пароль с переключением видимости.
