import type { RefObject } from 'react'
import type { View, ViewProps } from 'react-native'

/** Предпочтительная сторона подсказки относительно якоря. */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps extends Pick<ViewProps, 'testID'> {
  /** Текст визуальной подсказки. */
  text: string
  /** Ссылка на native View якоря. При отдельной обёртке задайте collapsable={false}. */
  anchorRef: RefObject<View | null>
  /** Управляет показом. */
  isVisible: boolean
  /**
   * Запрос закрытия при касании вне подсказки (включая начало свайпа) или Android Back.
   * Обновите isVisible снаружи.
   */
  onClose: () => void
  /**
   * Предпочтительная сторона, меняется при нехватке места.
   * @default 'top'
   */
  position?: TooltipPosition
}
