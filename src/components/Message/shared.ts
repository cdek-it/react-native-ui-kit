import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
} from '@tabler/icons-react-native'
import { Children, type ReactNode } from 'react'

export const hasMessageNode = (node: ReactNode) =>
  Children.toArray(node).length > 0

export const severityKey = {
  info: 'info',
  success: 'success',
  warning: 'warn',
  danger: 'error',
} as const
export const severityIcons = {
  info: IconInfoCircle,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  danger: IconAlertCircle,
} as const
export const decorativeProps = {
  accessible: false,
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants',
} as const
