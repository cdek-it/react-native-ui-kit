import type { ReactNode } from 'react'
import { View } from 'react-native'

import { styles } from './styles'
import type { InputVisualVariant } from './types'

interface InputTrailingContentProps {
  readonly variant: InputVisualVariant
  readonly children: ReactNode
}

export const InputTrailingContent = ({
  variant,
  children,
}: InputTrailingContentProps) => (
  <View style={styles.trailingContent(variant)}>{children}</View>
)
