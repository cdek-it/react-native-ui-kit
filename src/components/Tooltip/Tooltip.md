# Tooltip

Текстовая подсказка возле элемента с внешним управлением видимостью

## Использование

```tsx
import { useRef, useState } from 'react'
import type { View } from 'react-native'
import { Button, Tooltip, TooltipProvider } from '@cdek-it/react-native-ui-kit'

export const Example = () => {
  const anchorRef = useRef<View>(null)
  const [visible, setVisible] = useState(false)
  const explanation = 'Сохраняет PDF на устройство'

  return (
    <TooltipProvider>
      <Button
        pressableRef={anchorRef}
        label='Скачать'
        accessibilityLabel='Скачать накладную'
        accessibilityHint={explanation}
        onPress={() => setVisible(true)}
      />
      <Tooltip
        anchorRef={anchorRef}
        isVisible={visible}
        text={explanation}
        onClose={() => setVisible(false)}
      />
    </TooltipProvider>
  )
}
```

Разместите `TooltipProvider` вокруг экрана вне `ScrollView`. Он занимает
доступное пространство и рисует подсказки поверх содержимого. Внутри native
`Modal` подключите отдельный провайдер, а Android Back обработайте через
`onRequestClose` самой модалки

## Props

Полный контракт — [TooltipProps](./types.ts)

- `text` — только текст подсказки, без кнопок, ссылок и другого содержимого
- `anchorRef` — ссылка на native View якоря. Можно передать `pressableRef`
  кнопки UI Kit или ref отдельного `View` с `collapsable={false}`
- `isVisible` — управляет показом. До измерения и при включённой читалке overlay
  не отображается
- `onClose` — запрос закрытия при касании вне подсказки, включая начало свайпа,
  или Android Back. Компонент ждёт обновления `isVisible`
- `position` — предпочтительная сторона: `top`, `bottom`, `left` или `right`, по
  умолчанию `top`

При нехватке места Tooltip меняет сторону и сдвигается внутрь безопасной области
экрана в границах провайдера и над открытой клавиатурой. Фокус поля и клавиатура
сохраняются. Ширина ограничена, длинный текст переносится. При нехватке высоты
компонент сам обеспечивает внутреннюю прокрутку

Первое касание вне Tooltip только запрашивает закрытие и не передаётся элементам
под ним

При открытой клавиатуре на Android первое нажатие Back скрывает её, следующее
запрашивает закрытие подсказки

Закрывайте подсказку при уходе с экрана и программном перемещении якоря, в том
числе при прокрутке контейнера. Изменения размеров окна и текста обрабатываются
компонентом

## Доступность

При включённом VoiceOver/TalkBack Tooltip не создаёт overlay и не вызывает
`onClose`. Состояние читалки учитывается и при его изменении во время показа

Задавайте доступное имя на якоре через `accessibilityLabel`, если видимого
текста недостаточно. Дополнительное пояснение действия можно передать через
`accessibilityHint`. Tooltip не дополняет эти props автоматически через ref

Необходимая информация должна быть доступна без подсказки и hint: пользователь
VoiceOver может отключить озвучивание hints. Открытие Tooltip не заменяет
основное действие кнопки в сценарии с читалкой — выбирайте подходящий триггер на
стороне приложения

Системный масштаб текста поддерживается

## Макет

[Tooltip](https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=26170-69166&m=dev)

[Рекомендации по использованию](https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=26154-233386&m=dev)
