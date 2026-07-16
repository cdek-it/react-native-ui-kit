import { useContext } from 'react'
import { Text } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { genericMemo } from '../../../utils/genericMemo'
import type { BaseButtonProps, ButtonSize } from '../types'

import { ButtonPressedContext } from './ButtonPressedContext'
import { ButtonVariantContext } from './ButtonVariantContext'

export interface ButtonLabelProps {
  readonly iconOnly?: BaseButtonProps<never>['iconOnly']
  readonly label?: string
  readonly size: ButtonSize
  readonly disabled: boolean
  readonly loading: boolean
}

const ButtonLabelComponent = ({
  label,
  iconOnly,
  size,
  disabled,
  loading,
}: ButtonLabelProps) => {
  const pressed = useContext(ButtonPressedContext)
  const { variant, severity } = useContext(ButtonVariantContext)

  buttonLabelStyles.useVariants({
    size,
    variant,
    severity,
    pressed: pressed ? 'true' : 'false',
    disabled: disabled || loading ? 'true' : 'false',
  })

  if (iconOnly) {
    return null
  }

  return (
    <Text style={buttonLabelStyles.label} testID='Button_Text'>
      {label}
    </Text>
  )
}

export const ButtonLabel = genericMemo(ButtonLabelComponent)

const buttonLabelStyles = StyleSheet.create(({ theme, typography, fonts }) => ({
  label: {
    fontWeight: 600,
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.primary,
    variants: {
      size: {
        xlarge: { fontSize: typography.Size['text-xl'] },
        large: { fontSize: typography.Size['text-xl'] },
        base: { fontSize: typography.Size['text-base'] },
        small: { fontSize: typography.Size['text-sm'] },
      },
      variant: {
        primary: { color: theme.Button.root.primary.color },
        secondary: { color: theme.Button.root.secondary.color },
        tertiary: { color: theme.Button.root.contrast.color },
        text: { color: theme.Button.text.primary.color },
        link: { color: theme.Button.link.color },
        basic: { color: theme.Button.root.primary.color },
        outlined: { color: theme.Button.outlined.primary.color },
      },
      severity: { info: {}, success: {}, warning: {}, danger: {} },
      pressed: { true: {}, false: {} },
      disabled: { true: { color: theme.Button.disabledColor }, false: {} },
    },
    compoundVariants: [
      // link pressed color change
      {
        variant: 'link',
        pressed: 'true',
        styles: { color: typography.Color.Common['text-color-secondary'] },
      },

      // severity label colors
      {
        variant: 'basic',
        severity: 'info',
        styles: { color: theme.Button.root.info.color },
      },
      {
        variant: 'outlined',
        severity: 'info',
        styles: { color: theme.Button.outlined.info.color },
      },
      {
        variant: 'text',
        severity: 'info',
        styles: { color: theme.Button.text.info.color },
      },
      {
        variant: 'basic',
        severity: 'success',
        styles: { color: theme.Button.root.success.color },
      },
      {
        variant: 'outlined',
        severity: 'success',
        styles: { color: theme.Button.outlined.success.color },
      },
      {
        variant: 'text',
        severity: 'success',
        styles: { color: theme.Button.text.success.color },
      },
      {
        variant: 'basic',
        severity: 'warning',
        styles: { color: theme.Button.root.warn.color },
      },
      {
        variant: 'outlined',
        severity: 'warning',
        styles: { color: theme.Button.outlined.warn.color },
      },
      {
        variant: 'text',
        severity: 'warning',
        styles: { color: theme.Button.text.warn.color },
      },
      {
        variant: 'basic',
        severity: 'danger',
        styles: { color: theme.Button.root.danger.color },
      },
      {
        variant: 'outlined',
        severity: 'danger',
        styles: { color: theme.Button.outlined.danger.color },
      },
      {
        variant: 'text',
        severity: 'danger',
        styles: { color: theme.Button.text.danger.color },
      },
    ],
  },
}))
