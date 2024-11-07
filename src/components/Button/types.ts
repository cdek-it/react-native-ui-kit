import type { Icon } from '@tabler/icons-react-native'
import type { ColorValue, PressableProps, TextStyle, ViewStyle } from 'react-native'

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

export type ButtonProps = IconTextButton | IconOnlyButtonProps

export type LabelVariantStyles = Record<Required<BaseButtonProps>['variant'], TextStyle>
export type PressedVariantStyles = Record<Required<BaseButtonProps>['variant'], ViewStyle>
export type ContainerVariantStyles = Record<Required<BaseButtonProps>['variant'], ViewStyle>
export type IconVariantStyles = Record<Required<BaseButtonProps>['variant'], { color: ColorValue }>

export interface VariantStyles {
  containerVariantStyles: ContainerVariantStyles
  pressedVariantStyles: PressedVariantStyles
  labelVariantStyles: LabelVariantStyles
  iconVariantStyles: IconVariantStyles
}
