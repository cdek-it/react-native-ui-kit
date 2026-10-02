import { useContext } from 'react'
import { Text } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { genericMemo } from '../../../../utils/genericMemo'
import type { BaseButtonProps, ButtonSize } from '../../types'

import { ButtonPressedContext } from '../contexts/ButtonPressedContext'
import { ButtonVariantContext } from '../contexts/ButtonVariantContext'

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

const buttonLabelStyles = StyleSheet.create(
  ({ components: { button }, fonts }) => ({
    label: {
      fontWeight: fonts.fontWeight.demibold,
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontFamily: fonts.fontFamily.heading,
      letterSpacing: fonts.letterSpacing[500],
      variants: {
        size: {
          xlarge: {
            fontSize: fonts.fontSize[500],
            lineHeight: fonts.lineHeight[550],
          },
          large: {
            fontSize: fonts.fontSize[500],
            lineHeight: fonts.lineHeight[550],
          },
          base: {
            fontSize: fonts.fontSize[300],
            lineHeight: fonts.lineHeight[500],
          },
          small: {
            fontSize: fonts.fontSize[100],
            lineHeight: fonts.lineHeight[250],
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
        // link pressed color change
        {
          variant: 'link',
          pressed: 'true',
          styles: { color: button.colorScheme.link.activeColor },
        },

        ...(['primary', 'secondary', 'tertiary', 'basic'] as const).map(
          (variant) => ({
            variant,
            pressed: 'true' as const,
            styles: {
              color:
                button.colorScheme.root[
                  variant === 'tertiary'
                    ? 'contrast'
                    : variant === 'basic'
                      ? 'primary'
                      : variant
                ].activeColor,
            },
          })
        ),

        // severity label colors
        {
          variant: 'basic',
          severity: 'info',
          disabled: 'false',
          styles: { color: button.colorScheme.root.info.color },
        },
        {
          variant: 'basic',
          severity: 'info',
          disabled: 'false',
          pressed: 'true',
          styles: { color: button.colorScheme.root.info.activeColor },
        },
        {
          variant: 'outlined',
          severity: 'info',
          disabled: 'false',
          styles: { color: button.colorScheme.outlined.info.color },
        },
        {
          variant: 'text',
          severity: 'info',
          disabled: 'false',
          styles: { color: button.colorScheme.text.info.color },
        },
        {
          variant: 'basic',
          severity: 'success',
          disabled: 'false',
          styles: { color: button.colorScheme.root.success.color },
        },
        {
          variant: 'basic',
          severity: 'success',
          disabled: 'false',
          pressed: 'true',
          styles: { color: button.colorScheme.root.success.activeColor },
        },
        {
          variant: 'outlined',
          severity: 'success',
          disabled: 'false',
          styles: { color: button.colorScheme.outlined.success.color },
        },
        {
          variant: 'text',
          severity: 'success',
          disabled: 'false',
          styles: { color: button.colorScheme.text.success.color },
        },
        {
          variant: 'basic',
          severity: 'warning',
          disabled: 'false',
          styles: { color: button.colorScheme.root.warn.color },
        },
        {
          variant: 'basic',
          severity: 'warning',
          disabled: 'false',
          pressed: 'true',
          styles: { color: button.colorScheme.root.warn.activeColor },
        },
        {
          variant: 'outlined',
          severity: 'warning',
          disabled: 'false',
          styles: { color: button.colorScheme.outlined.warn.color },
        },
        {
          variant: 'text',
          severity: 'warning',
          disabled: 'false',
          styles: { color: button.colorScheme.text.warn.color },
        },
        {
          variant: 'basic',
          severity: 'danger',
          disabled: 'false',
          styles: { color: button.colorScheme.root.danger.color },
        },
        {
          variant: 'basic',
          severity: 'danger',
          disabled: 'false',
          pressed: 'true',
          styles: { color: button.colorScheme.root.danger.activeColor },
        },
        {
          variant: 'outlined',
          severity: 'danger',
          disabled: 'false',
          styles: { color: button.colorScheme.outlined.danger.color },
        },
        {
          variant: 'text',
          severity: 'danger',
          disabled: 'false',
          styles: { color: button.colorScheme.text.danger.color },
        },
      ],
    },
  })
)
