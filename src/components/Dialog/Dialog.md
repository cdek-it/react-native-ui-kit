# Dialog

Управляемое модальное окно с отдельными шапкой, содержимым и футером.

## Использование

```tsx
import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogHeader,
  Body,
} from '@cdek-it/react-native-ui-kit'

export function OrderDialog() {
  const [visible, setVisible] = useState(false)
  const close = () => setVisible(false)

  return (
    <>
      <Button label='Детали заказа' onPress={() => setVisible(true)} />
      <Dialog
        visible={visible}
        onClose={close}
        header={<DialogHeader title='Детали заказа' onClose={close} />}
        footer={
          <DialogActions
            actions={[{ key: 'close', label: 'Понятно', onPress: close }]}
          />
        }
      >
        <Body>Заказ готов к отправке</Body>
      </Dialog>
    </>
  )
}
```

## Props

- `visible` — управляет видимостью окна, по умолчанию `false`
- `onClose` — запрашивает закрытие по нажатию на фон, системной команде или
  accessibility escape. Потребитель меняет `visible` самостоятельно
- `closeOnBackdropPress` — разрешает закрытие по нажатию на фон, по умолчанию
  `true`. Системное закрытие и accessibility escape работают независимо от него
- `avoidKeyboard` — адаптирует окно к клавиатуре, по умолчанию `true`. Передайте
  `false`, если обрабатываете её самостоятельно
- `onHideComplete` — вызывается один раз после завершённой анимации закрытия.
  Прерванное закрытие и размонтирование не вызывают callback
- `header` — готовая шапка, обычно `DialogHeader`
- `children` — основное содержимое
- `footer` — готовый React-элемент с действиями или другим содержимым

Полный контракт — [DialogProps](./Dialog.tsx).

Ширина окна — ширина экрана за вычетом 16 с каждой стороны, но не больше 336.
Обычно высота окна ограничена высотой экрана за вычетом 100. Если шапка и
действия оставляют слишком мало места для body, поверхность становится выше
видимой области и располагается сверху с учётом safe area. Без клавиатуры
внешняя прокрутка выключена, нижняя часть окна может не поместиться. С открытой
клавиатурой и включённым `avoidKeyboard` весь диалог можно прокрутить, включая
шапку и действия.

Для длинного содержимого передавайте `ScrollView` или список в `children`. Шапка
и футер находятся вне прокрутки body. При открытой клавиатуре и нехватке высоты
они могут прокручиваться вместе со всем диалогом. Внутренние отступы тела
добавляет Dialog.

```tsx
<Dialog visible={visible} onClose={close} header={header} footer={footer}>
  <ScrollView nestedScrollEnabled style={{ flexGrow: 0, flexShrink: 1 }}>
    <Body>{longText}</Body>
  </ScrollView>
</Dialog>
```

`ScrollView` в этом примере импортируется из `react-native`.

Dialog учитывает перекрытие клавиатурой внутри Modal. На Android нативное
изменение размера окна может сохраняться и при `avoidKeyboard={false}`.
Потребитель управляет фокусом и прокруткой к нужному полю. Для вложенной
прокрутки на Android задайте `nestedScrollEnabled` у ScrollView или списка. Не
добавляйте второй механизм учёта высоты клавиатуры одновременно со встроенным —
это может удвоить отступ.

## DialogActions

Адаптивная группа кнопок для `footer`. Действия передаются массивом `actions` со
стабильными `key`, подписями `label` и свойствами Button. Порядок и варианты
оформления сохраняются. Размер `large` и обычная форма `rounded=false`
фиксированы: `size`, `rounded`, устаревший `shape` и внешний `style` не
принимаются. Иконку рядом с обязательной подписью задают через `Icon`, её
положение — через `iconPosition`. Доступны обработчики, `disabled`, `loading` и
остальные разрешённые свойства исходной кнопки. Для обычных кнопок задайте
`variant`, для статусных — `severity` и необязательный `appearance` (`filled` по
умолчанию, `outlined` или `text`). Например:
`{ key: 'delete', label: 'Удалить', severity: 'danger', onPress: remove }`.

Если кнопки помещаются, они поровну делят ширину строки. Иначе, а также при
масштабе шрифта от 200%, идут столбцом на всю ширину. Подписи должны помещаться
в одну строку полноширинной кнопки; слишком длинные подписи сократите.

```tsx
import { DialogActions } from '@cdek-it/react-native-ui-kit'
;<Dialog
  visible={visible}
  onClose={close}
  footer={
    <DialogActions
      actions={[
        { key: 'cancel', label: 'Отмена', variant: 'tertiary', onPress: close },
        { key: 'save', label: 'Сохранить', variant: 'primary', onPress: save },
      ]}
    />
  }
>
  <Body>Проверьте данные перед сохранением</Body>
</Dialog>
```

Произвольный `footer` можно передать напрямую. Самостоятельно используемому
DialogActions задайте ширину родительского контейнера. Полный контракт —
[DialogActionsProps и DialogAction](./DialogActions.tsx).

## DialogHeader

Шапка с заголовком, необязательными статусной иконкой и кнопкой закрытия.

- `title` — текст заголовка. Занимает одну строку и сокращается многоточием
- `severity` — иконка статуса перед заголовком: `danger`, `warning`, `success`,
  `info` или `help`. По умолчанию иконки нет
- `onClose` — показывает кнопку закрытия и вызывается без аргументов при
  нажатии. Для Dialog и его шапки обычно передают один обработчик

Полный контракт — [DialogHeaderProps](./DialogHeader.tsx).

## Доступность

Dialog передаёт свойства доступности контейнеру содержимого с ролью `dialog`.
Кнопки и поля внутри остаются отдельными целями фокуса.

Доступное имя берётся из `accessibilityLabel` или стандартного `DialogHeader`.
Для окна без шапки или с произвольной шапкой рекомендуется явно задать
`accessibilityLabel`.

Стандартный заголовок имеет роль `header` и передаёт скринридеру полный текст,
даже если визуально сокращён. После нативного показа Dialog запрашивает фокус на
заголовке. Без стандартной шапки действует нативный порядок фокуса.
Восстановление фокуса после закрытия выполняет нативный Modal, его поведение
зависит от платформы.

Кнопка закрытия имеет имя «Закрыть диалог». Для уточнения контекста используйте
`DialogHeader.closeAccessibilityLabel`.

Фон, разделитель и статусная иконка скрыты от скринридера. Если статус важен для
понимания окна, передайте его в тексте заголовка или тела.

## Макет

[Dialog в Figma](https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=520-6572)
и
[шапка Dialog](https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=520-6548).

[Варианты со статусной иконкой](https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=520-6928).
