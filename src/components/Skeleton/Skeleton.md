# Skeleton

Декоративный плейсхолдер с анимацией градиента для загружаемого контента.

## Использование

```tsx
import { View } from 'react-native'
import { Skeleton } from '@cdek-it/react-native-ui-kit'

export function ProfileLoading() {
  return (
    <View
      accessible
      accessibilityLabel='Загрузка профиля'
      accessibilityState={{ busy: true }}
      style={{ gap: 8 }}
    >
      <Skeleton style={{ width: 48, height: 48, borderRadius: 24 }} />
      <Skeleton style={{ width: 160, height: 16 }} />
    </View>
  )
}
```

Используйте внутри `ThemeContextProvider` UI Kit: Skeleton в нём анимируются
синхронно. Размер и форму задавайте через `style`. Размеры по умолчанию не
заданы.

## Props

Собственных props нет. Поддерживаются нативные props View, кроме `onLayout`.

Полный контракт — [SkeletonProps](./Skeleton.tsx).

## Доступность

Skeleton декоративный: `accessible` всегда `false`. Описание, роль и состояние
загрузки задавайте общему контейнеру. После загрузки замените плейсхолдеры
контентом, обновите описание контейнера и сбросьте `accessibilityState.busy`.

## Макет

[Skeleton в Figma](https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=5221-12465&m=dev)
