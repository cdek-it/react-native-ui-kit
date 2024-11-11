import type { Icon } from '@tabler/icons-react-native'
import type { PressableProps } from 'react-native'

export interface BaseButtonProps extends PressableProps {
  /**
   * Controls button size
   * @default 'base'
   */
  size?: 'xlarge' | 'large' | 'base' | 'small'
  /**
   * Controls button shape
   * @default 'square'
   */
  shape?: 'square' | 'circle'
  /**
   * Controls button loading state
   * @default false
   */
  loading?: boolean
  /**
   * Button visual presentation type
   * @default 'basic'
   */
  variant?: 'basic' | 'outlined' | 'text'
  /**
   * Icon position
   * @default 'left'
   */
  iconPosition?: 'left' | 'right'
  /**
   * Controls icon only button variant
   */
  iconOnly?: unknown
  /**
   * Icon from Tabler
   * @default undefined
   */
  Icon?: Icon
  /**
   * Label in button
   */
  label?: string
}

export interface IconTextButton extends BaseButtonProps {
  label: string
  iconOnly?: never
}

export interface IconOnlyButtonProps extends BaseButtonProps {
  Icon: Icon
  iconOnly: true
  iconPosition?: never
  label?: never
}
