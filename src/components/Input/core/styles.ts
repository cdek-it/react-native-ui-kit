import { StyleSheet } from 'react-native-unistyles'

import type { InputTextSize } from './types'

export const styles = StyleSheet.create(({ components, semantic }) => ({
  icon: (size: InputTextSize = 'base') => {
    const iconSize = {
      small: semantic.dimension.size[400],
      base: components.inputtext.extend.iconSize,
      large: semantic.dimension.size[500],
      xlarge: semantic.dimension.size[600],
    }[size]

    return { width: iconSize, height: iconSize }
  },
}))
