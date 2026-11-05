import { StyleSheet } from 'react-native-unistyles'

import type { InputTextBaseProps, InputTextSize } from './InputTextBase/types'

const legacyStyles = StyleSheet.create(({ semantic }) => ({
  medium: { minHeight: semantic.dimension.size[1200] },
}))

export const resolveInputTextMinHeight = (
  size: NonNullable<InputTextBaseProps['size']>,
  sizes: Record<InputTextSize, { readonly minHeight: number }>
) => {
  if (typeof size === 'number') {
    return Math.max(size, sizes.base.minHeight)
  }

  return size === 'medium'
    ? legacyStyles.medium.minHeight
    : sizes[size].minHeight
}
