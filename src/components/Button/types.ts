import type { Ref } from 'react'
import type { PressableProps, View } from 'react-native'

import type { SvgSource } from '../../utils/SvgUniversal'
import type { BadgeSeverity } from '../Badge/Badge'

export type ButtonBaseVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'text'
  | 'link'
export type ButtonSeverityVariant = 'basic' | 'outlined' | 'text'
export type ButtonSeverityAppearance = 'filled' | 'outlined' | 'text'
export type ButtonVariant = ButtonBaseVariant | ButtonSeverityVariant
export type ButtonSize = 'xlarge' | 'large' | 'base' | 'small'
export type ButtonShape = 'square' | 'circle'
export type ButtonIconPosition = 'prefix' | 'postfix'

export interface BaseButtonProps<
  Variant extends ButtonVariant,
> extends PressableProps {
  /**
   * Размер кнопки
   * @default 'base'
   */
  size?: ButtonSize
  /**
   * Форма кнопки.
   * @deprecated Используйте rounded. Удаляется в версии 2.0
   */
  shape?: ButtonShape
  /**
   * Скругление углов кнопки
   * @default false
   */
  rounded?: boolean
  /**
   * Состояние загрузки кнопки
   * @default false
   */
  loading?: boolean
  /**
   * Вариант оформления кнопки
   */
  variant?: Variant
  /**
   * Положение иконки относительно текста
   * @default 'prefix'
   */
  iconPosition?: ButtonIconPosition
  /**
   * Кнопка только с иконкой, без текста
   */
  iconOnly?: unknown
  /**
   * SVG-иконка
   * @default undefined
   */
  Icon?: SvgSource
  /**
   * Текст кнопки
   */
  label?: string
  /**
   * Ссылка на компонент Pressable
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
  /**
   * До версии 2.0 необязательное для совместимости; в 2.0 станет обязательным
   */
  accessibilityLabel?: string
  Icon: SvgSource
  iconOnly: true
  iconPosition?: never
  label?: never
}

export type ButtonProps<Variant extends ButtonVariant> =
  | IconTextButton<Variant>
  | IconOnlyButtonProps<Variant>

export type ButtonSeverity = 'info' | 'success' | 'warning' | 'danger'

export interface ButtonSeverityProps {
  /**
   * Семантический цвет кнопки
   */
  severity: ButtonSeverity
  /**
   * @default 'filled'
   */
  appearance?: ButtonSeverityAppearance
  /**
   * @deprecated Используйте appearance. Удаляется в версии 2.0
   */
  variant?: ButtonSeverityVariant
}

export interface ButtonBadgeProps {
  /**
   * Цвет бейджа.
   *
   * @type {BadgeSeverity}
   */
  badgeSeverity: BadgeSeverity
  /**
   * Текст внутри бейджа. Если не указан, то бейдж будет в форме точки
   */
  badgeLabel?: string
}
