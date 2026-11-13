import type { RefObject } from 'react'
import type { View, ViewProps } from 'react-native'

/** Предпочтительная сторона подсказки относительно якоря. */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps extends Pick<ViewProps, 'testID'> {
  /** Текст визуальной подсказки. Доступное имя и hint задаются на якоре. */
  text: string
  /** Ссылка на native View якоря. При отдельной обёртке задайте collapsable={false}. */
  anchorRef: RefObject<View | null>
  /** Управляет показом. При включённом VoiceOver/TalkBack overlay не отображается. */
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
