import { useMemo } from 'react'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'

import { useFontConfig } from '../hooks/useFontConfig'
import { useTheme } from '../hooks/useTheme'
import {
  type ThemeType,
  darkTheme,
  lightTheme,
  ThemeVariant,
  type FontWeight,
  type FontConfig,
} from '../theme'

export const makeStyles =
  <T extends CustomStylesObject>(createStyles: CreateStyles<T>): (() => T) =>
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
    const fontConfig = useFontConfig()

    return normalizeFontFamily(createStyles(themeValues) as T, fontConfig)
  }

const normalizeFontFamily = <T extends CustomStylesObject>(
  styles: T,
  fontConfig?: FontConfig
): T => {
  if (!fontConfig) {
    return styles
  }

  const knownFontFamilies = [
    ...Object.values(fontConfig.normal),
    ...Object.values(fontConfig.italic),
  ]

  Object.values(styles).forEach((value: CustomStylesItem) => {
    if (isTextStyle(value) && value.fontFamily && !knownFontFamilies.includes(value.fontFamily)) {
      const fontStyle = value.fontStyle || 'normal'
      const fontWeight = value.fontWeight || 400

      value.fontFamily = fontConfig[fontStyle][fontWeight]

      delete value.fontStyle
      delete value.fontWeight
    }
  })

  return styles
}

const isTextStyle = (style: ViewStyle | ImageStyle | TextStyle): style is TextStyle =>
  'fontFamily' in style

type CustomStylesItem = (ViewStyle | ImageStyle | TextStyle) & {
  fontWeight?: FontWeight
}

type CustomStylesObject = Record<string, CustomStylesItem>

type CreateStyles<T extends CustomStylesObject> = (
  theme: ThemeType
) => CheckInvalidProps<T> extends never ? T : 'TypeError. Invalid key of style property was used.'

type ExcludeStylesProps<T> = Exclude<keyof T, keyof (ViewStyle & ImageStyle & TextStyle)>

type CheckInvalidProps<T extends object> = {
  [Key in keyof T]: ExcludeStylesProps<T[Key]>
}[keyof T]
