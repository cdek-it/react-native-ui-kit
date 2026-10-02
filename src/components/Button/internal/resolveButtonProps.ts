import type {
  ButtonSeverityAppearance,
  ButtonSeverityVariant,
  ButtonShape,
} from '../types'

export const resolveButtonShape = (
  rounded?: boolean,
  shape?: ButtonShape
): ButtonShape =>
  rounded === undefined ? (shape ?? 'square') : rounded ? 'circle' : 'square'

export const resolveButtonSeverityVariant = (
  appearance?: ButtonSeverityAppearance,
  variant?: ButtonSeverityVariant
): ButtonSeverityVariant =>
  appearance === undefined
    ? (variant ?? 'basic')
    : appearance === 'filled'
      ? 'basic'
      : appearance

export const resolveButtonVisualState = (
  loading: boolean,
  disabled: boolean,
  pressed: boolean
) =>
  loading ? 'loading' : disabled ? 'disabled' : pressed ? 'pressed' : 'default'
