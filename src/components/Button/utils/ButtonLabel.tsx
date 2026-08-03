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

// TODO(tokens-migration): reason=missing; legacy=typography.Color.Common.text-color-secondary; value=#85888e
const buttonLabelStyles = StyleSheet.create(
  ({ primitive, components: { button }, typography, fonts }) => ({
    label: {
      fontWeight: 600,
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontFamily: fonts.primary,
      variants: {
        size: {
          xlarge: { fontSize: primitive.fonts.fontSize[500] },
          large: { fontSize: primitive.fonts.fontSize[500] },
          base: { fontSize: primitive.fonts.fontSize[300] },
          small: { fontSize: primitive.fonts.fontSize[100] },
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
