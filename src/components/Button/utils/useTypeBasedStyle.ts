import { useMemo } from 'react'
import type { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native'

export const useTypeBasedStyle = <
  Type extends string,
  Style extends TextStyle | ViewStyle | ImageStyle | object,
>(
  type: Type,
  styles: Record<Type, StyleProp<Style>>
) => {
  return useMemo(() => styles[type], [styles, type])
}
