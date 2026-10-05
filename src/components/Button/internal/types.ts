import type { TextStyle, ViewStyle } from 'react-native'

import type { ThemeType } from '../../../theme'

import type {
  ButtonBaseVariant,
  ButtonSeverity,
  ButtonSeverityAppearance,
  ButtonSize,
} from '../types'

export type ButtonVisualVariant = ButtonBaseVariant | ButtonSeverityAppearance
export type ButtonVisualState = 'default' | 'pressed' | 'disabled' | 'loading'

export interface ButtonStyleProps {
  variant: ButtonVisualVariant
  severity?: ButtonSeverity
  state: ButtonVisualState
  size: ButtonSize
  rounded: boolean
  iconOnly: boolean
}

export type ButtonLayoutProps = Pick<
  ButtonStyleProps,
  'size' | 'rounded' | 'iconOnly' | 'state'
>

export interface ButtonResolvedStyles {
  container: ViewStyle
  label: TextStyle
  icon: (theme: ThemeType) => { color: string; width: number; height: number }
}

export type ButtonStyleResolver = (
  props: ButtonLayoutProps
) => ButtonResolvedStyles

export type ButtonAppearanceProps = Omit<
  ButtonStyleProps,
  'variant' | 'severity'
> & { variant: ButtonBaseVariant }

export type SeverityButtonAppearanceProps = Omit<
  ButtonStyleProps,
  'variant' | 'severity'
> & { variant: ButtonSeverityAppearance; severity: ButtonSeverity }
