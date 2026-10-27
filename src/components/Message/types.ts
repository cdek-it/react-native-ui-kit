import type { ReactNode } from 'react'
import type {
  AccessibilityProps,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native'

import type { SvgSource } from '../../utils/SvgUniversal'

export interface MessageProps
  extends AccessibilityProps, Pick<ViewProps, 'testID'> {
  title: string
  caption?: string
  body?: ReactNode
  footer?: ReactNode
  severity?: 'info' | 'success' | 'warning' | 'danger'
  Icon?: SvgSource
  hiddenIcon?: boolean
  onClose?: () => void
  closeLabel?: string
  closeAccessibilityLabel?: string
  /** Длительность отсчёта в секундах. */
  timerValue?: number
  onTimerFinish?: () => void
  style?: StyleProp<ViewStyle>
}

export type MessageSeverity = NonNullable<MessageProps['severity']>
