# Password

Парольное поле с переключением видимости.

## Использование

```tsx
import { useState } from 'react'
import { Password } from '@cdek-it/react-native-ui-kit'

export function PasswordField() {
  const [password, setPassword] = useState('')

  return <Password label='Пароль' value={password} onChangeText={setPassword} />
}
```

Пароль изначально скрыт. Переключение видимости сохраняет значение и не вызывает
`onChangeText`.

## Props

- `toggleMask` — показывает кнопку переключения видимости, по умолчанию `true`.
- `clearable` — включает очистку непустого редактируемого поля, по умолчанию
  `false`.

Остальные props, обработчики и `ref` — как у
[InputText](../InputText/InputText.md). `secureTextEntry` и `multiline`
исключены из API Password.

Режимы подписей — в разделе
[«Режимы label»](../InputText/InputText.md#режимы-label).

Полный контракт — [PasswordProps](./types.ts).

## Автозаполнение

Для текущего пароля задайте `autoComplete='current-password'` и
`textContentType='password'`. Для нового — `autoComplete='new-password'` и
`textContentType='newPassword'`.

## Доступность

Кнопка озвучивается как «Показать пароль» или «Скрыть пароль» в зависимости от
текущего действия. `disabled` отключает поле и кнопку. `readOnly` сохраняет
переключение видимости.
