import { useMemo } from 'react'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'

import type { ThemeType } from '../theme'

import { useUnistyles } from './index'

/**
 * @deprecated Используйте `StyleSheet.create(...)` из SDK.
 *
 * `makeStyles` использует `useUnistyles()`, что вызывает React-ререндеры при смене
 * темы. `StyleSheet.create(...)` — нативный путь, обновляет стили **без** ререндеров.
 *
 * Будет удалён в следующей minor версии.
 */
export const makeStyles =
  <T extends StylesObject>(createStyles: CreateStyles<T>): (() => T) =>
  (): T => {
    const { theme } = useUnistyles()

    return useMemo(() => createStyles(theme) as T, [theme])
  }

type StylesItem = ViewStyle | ImageStyle | TextStyle

type StylesObject = Record<string, StylesItem>

type CreateStyles<T extends StylesObject> = (
  theme: ThemeType
) => CheckInvalidProps<T> extends never
  ? T
  : 'TypeError. Invalid key of style property was used.'

type ExcludeStylesProps<T> = Exclude<
  keyof T,
  keyof (ViewStyle & ImageStyle & TextStyle)
>

type CheckInvalidProps<T extends object> = {
  [Key in keyof T]: ExcludeStylesProps<T[Key]>
}[keyof T]
