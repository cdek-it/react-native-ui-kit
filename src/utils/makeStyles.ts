import { useMemo } from 'react'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'

import { useTheme } from '../hooks/useTheme'
import { type ThemeType, darkTheme, lightTheme, ThemeVariant } from '../theme'

export const makeStyles =
  <T extends StylesObject>(createStyles: CreateStyles<T>): (() => T) =>
  () => {
    const theme = useTheme()
    const themeValues = useMemo(() => {
      switch (theme) {
        case ThemeVariant.Light:
          return lightTheme

        case ThemeVariant.Dark:
          return darkTheme

        default:
          return lightTheme
      }
    }, [theme])

    return createStyles(themeValues) as T
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
