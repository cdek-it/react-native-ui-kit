import type { Ref } from 'react'
import type {
  ColorValue,
  PressableProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import type { SvgSource } from '../../utils/SvgUniversal'
import type { BadgeSeverity } from '../Badge/Badge'

export type ButtonBaseVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'text'
  | 'link'
export type ButtonSeverityVariant = 'basic' | 'outlined' | 'text'
export type ButtonVariant = ButtonBaseVariant | ButtonSeverityVariant
export type ButtonSize = 'xlarge' | 'large' | 'base' | 'small'
export type ButtonShape = 'square' | 'circle'
export type ButtonIconPosition =
  /** @deprecated */
  | 'left'
  /** @deprecated */
  | 'right'
  | 'prefix'
  | 'postfix'

export interface BaseButtonProps<
  Variant extends ButtonVariant,
> extends PressableProps {
  /**
   * Controls button size
   * @default 'base'
   */
  size?: ButtonSize
  /**
   * Controls button shape
   * @default 'square'
   */
  shape?: ButtonShape
  /**
   * Controls button loading state
   * @default false
   */
  loading?: boolean
  /**
   * Button visual presentation type
   */
  variant?: Variant
  /**
   * Icon position
   *
   * Важно: значения left и right - deprecated!!! Используйте prefix и postfix
   *
   * @default 'prefix'
   */
  iconPosition?: ButtonIconPosition
  /**
   * Controls icon only button variant
   */
  iconOnly?: unknown
  /**
   * SVG icon
   * @default undefined
   */
  Icon?: SvgSource
  /**
   * Label in button
   */
  label?: string
  /**
   * Ref for the pressable component
   */
  pressableRef?: Ref<View>
}

export interface IconTextButton<
  Variant extends ButtonVariant,
> extends BaseButtonProps<Variant> {
  label: string
  iconOnly?: never
}

export interface IconOnlyButtonProps<
  Variant extends ButtonVariant,
> extends BaseButtonProps<Variant> {
  Icon: SvgSource
  iconOnly: true
  iconPosition?: never
  label?: never
}

export type ButtonProps<Variant extends ButtonVariant> =
  | IconTextButton<Variant>
  | IconOnlyButtonProps<Variant>

export type LabelVariantStyles<Variant extends ButtonVariant> = Record<
  Required<BaseButtonProps<Variant>>['variant'],
  TextStyle
>
export type PressedVariantStyles<Variant extends ButtonVariant> = Record<
  Required<BaseButtonProps<Variant>>['variant'],
  ViewStyle
>
export type ContainerVariantStyles<Variant extends ButtonVariant> = Record<
  Required<BaseButtonProps<Variant>>['variant'],
  ViewStyle
>
export type IconVariantStyles<Variant extends ButtonVariant> = Record<
  Required<BaseButtonProps<Variant>>['variant'],
  { color: ColorValue }
>
export type PressedLabelVariantStyles<Variant extends ButtonVariant> = Record<
  Required<BaseButtonProps<Variant>>['variant'],
  { color: ColorValue }
>

export interface VariantStyles<Variant extends ButtonVariant> {
  containerVariantStyles: ContainerVariantStyles<Variant>
  pressedVariantStyles: PressedVariantStyles<Variant>
  labelVariantStyles: LabelVariantStyles<Variant>
  iconVariantStyles: IconVariantStyles<Variant>
  pressedLabelVariantStyles: PressedLabelVariantStyles<Variant>
}

export type ButtonSeverity = 'info' | 'success' | 'warning' | 'danger'

export interface ButtonSeverityProps {
  /**
   * Controls severity button styling variant
   */
  severity: ButtonSeverity
  variant?: ButtonSeverityVariant
}

export interface ButtonBadgeProps {
  /**
   * Controls color of Badge component
   *
   * @type {BadgeSeverity}
   */
  badgeSeverity: BadgeSeverity
  /**
   * Текст внутри бейджа. Если не указан, то бейдж будет в форме точки.
   */
  badgeLabel?: string
}
