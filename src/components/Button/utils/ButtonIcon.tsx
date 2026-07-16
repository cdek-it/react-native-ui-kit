import { useContext } from 'react'

import { StyleSheet } from 'react-native-unistyles'

import { SvgUniversal } from '../../../utils/SvgUniversal'
import { genericMemo } from '../../../utils/genericMemo'
import type { BaseButtonProps, ButtonSize } from '../types'

import { ButtonPressedContext } from './ButtonPressedContext'
import { ButtonVariantContext } from './ButtonVariantContext'

export interface ButtonIconProps {
  readonly size: ButtonSize
  readonly disabled: boolean
  readonly loading: boolean
  readonly Icon?: BaseButtonProps<never>['Icon']
}

const ButtonIconComponent = ({
  size,
  disabled,
  loading,
  Icon,
}: ButtonIconProps) => {
  const pressed = useContext(ButtonPressedContext)
  const { variant, severity } = useContext(ButtonVariantContext)

  buttonIconStyles.useVariants({
    size,
    variant,
    severity,
    pressed: pressed ? 'true' : 'false',
    disabled: disabled || loading ? 'true' : 'false',
  })

  if (!Icon) {
    return null
  }

  return (
    <SvgUniversal
      {...buttonIconStyles.icon}
      source={Icon}
      testID='Button_Icon'
    />
  )
}

export const ButtonIcon = genericMemo(ButtonIconComponent)

const buttonIconStyles = StyleSheet.create(({ theme, typography }) => ({
  icon: {
    variants: {
      size: {
        xlarge: {
          height: typography.Size['text-2xl'],
          width: typography.Size['text-2xl'],
        },
        large: {
          height: typography.Size['text-2xl'],
          width: typography.Size['text-2xl'],
        },
        base: {
          height: typography.Size['text-xl'],
          width: typography.Size['text-xl'],
        },
        small: {
          height: typography.Size['text-base'],
          width: typography.Size['text-base'],
        },
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
      // link pressed
      {
        variant: 'link',
        pressed: 'true',
        styles: { color: typography.Color.Common['text-color-secondary'] },
      },

      // severity icon colors
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
