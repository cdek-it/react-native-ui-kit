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

// TODO(tokens-migration): reason=missing; legacy=typography.Color.Common.text-color-secondary; value=#85888e
const buttonIconStyles = StyleSheet.create(
  ({ primitive, components: { button }, typography }) => ({
    icon: {
      variants: {
        size: {
          xlarge: {
            height: primitive.fonts.fontSize[600],
            width: primitive.fonts.fontSize[600],
          },
          large: {
            height: primitive.fonts.fontSize[600],
            width: primitive.fonts.fontSize[600],
          },
          base: {
            height: primitive.fonts.fontSize[500],
            width: primitive.fonts.fontSize[500],
          },
          small: {
            height: primitive.fonts.fontSize[300],
            width: primitive.fonts.fontSize[300],
          },
        },
        variant: {
          primary: { color: button.colorScheme.root.primary.color },
          secondary: { color: button.colorScheme.root.secondary.color },
          tertiary: { color: button.colorScheme.root.contrast.color },
          text: { color: button.colorScheme.text.primary.color },
          link: { color: button.colorScheme.link.color },
          basic: { color: button.colorScheme.root.primary.color },
          outlined: { color: button.colorScheme.outlined.primary.color },
        },
        severity: { info: {}, success: {}, warning: {}, danger: {} },
        pressed: { true: {}, false: {} },
        disabled: { true: { color: button.extend.disabledColor }, false: {} },
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
          styles: { color: button.colorScheme.root.info.color },
        },
        {
          variant: 'outlined',
          severity: 'info',
          styles: { color: button.colorScheme.outlined.info.color },
        },
        {
          variant: 'text',
          severity: 'info',
          styles: { color: button.colorScheme.text.info.color },
        },
        {
          variant: 'basic',
          severity: 'success',
          styles: { color: button.colorScheme.root.success.color },
        },
        {
          variant: 'outlined',
          severity: 'success',
          styles: { color: button.colorScheme.outlined.success.color },
        },
        {
          variant: 'text',
          severity: 'success',
          styles: { color: button.colorScheme.text.success.color },
        },
        {
          variant: 'basic',
          severity: 'warning',
          styles: { color: button.colorScheme.root.warn.color },
        },
        {
          variant: 'outlined',
          severity: 'warning',
          styles: { color: button.colorScheme.outlined.warn.color },
        },
        {
          variant: 'text',
          severity: 'warning',
          styles: { color: button.colorScheme.text.warn.color },
        },
        {
          variant: 'basic',
          severity: 'danger',
          styles: { color: button.colorScheme.root.danger.color },
        },
        {
          variant: 'outlined',
          severity: 'danger',
          styles: { color: button.colorScheme.outlined.danger.color },
        },
        {
          variant: 'text',
          severity: 'danger',
          styles: { color: button.colorScheme.text.danger.color },
        },
      ],
    },
  })
)
