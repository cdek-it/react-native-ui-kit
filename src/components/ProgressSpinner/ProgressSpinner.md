# ProgressSpinner

Индикатор ожидания без определённого прогресса. После завершения загрузки
замените его содержимым.

## Использование

```tsx
import { ProgressSpinner } from '@cdek-it/react-native-ui-kit'

export function OrdersLoading() {
  return <ProgressSpinner accessibilityLabel='Загрузка заказов' />
}
```

## Props

- `size` — размер: `small`, `base`, `large` или `xlarge`. По умолчанию `base`.
- `fill` — цвет: `primary` или `white`. По умолчанию `primary`; для `white`
  используйте контрастный фон.

Полный контракт — [ProgressSpinnerProps](./ProgressSpinner.tsx).

## Доступность

По умолчанию корневой SVG доступен: `accessible={true}`,
`accessibilityRole='progressbar'`. Доступное имя автоматически не задаётся;
передавайте `accessibilityLabel`, описывающий загрузку. При необходимости можно
задать `accessibilityHint`. `accessible` и `accessibilityRole` можно
переопределить.

`accessibilityState.busy` всегда `true`, даже при переданном `busy: false`.
Остальные поля `accessibilityState` сохраняются. После загрузки уберите
индикатор, а не пытайтесь сбросить его `busy`.

Внутри кнопки или другого доступного контейнера передайте спиннеру
`accessible={false}`, чтобы избежать отдельного объявления индикатора. Доступное
имя, роль и состояние загрузки в таком случае задавайте родителю.

При включённом системном Reduce Motion вместо анимации отображается статичная
полуокружность. Компонент отслеживает изменение этой настройки.
