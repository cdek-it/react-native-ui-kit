import { useContext } from 'react'
import { Text } from 'react-native'

import { StyleSheet } from '../../../utils'
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
        primary: { color: theme.Button.Brand.buttonTextColor },
        secondary: { color: theme.Button.Primary.secondaryButtonTextColor },
        tertiary: { color: theme.Button.Secondary.helpButtonTextColor },
        text: { color: theme.Button.Text.textButtonTextColor },
        link: { color: theme.Button.Text.textButtonTextColor },
        basic: { color: theme.Button.Brand.buttonTextColor },
        outlined: { color: theme.Button.Brand.buttonTextColor },
      },
      severity: { info: {}, success: {}, warning: {}, danger: {} },
      pressed: { true: {}, false: {} },
      disabled: {
        true: { color: theme.Button.Disabled.disabledButtonTextColor },
        false: {},
      },
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
        styles: { color: theme.Button.Severity.Info.Basic.infoButtonTextColor },
      },
      {
        variant: 'outlined',
        severity: 'info',
        styles: {
          color:
            theme.Button.Severity.Info.Outlined.infoOutlinedButtonTextColor,
        },
      },
      {
        variant: 'text',
        severity: 'info',
        styles: {
          color: theme.Button.Severity.Info.Text.infoTextButtonTextColor,
        },
      },
      {
        variant: 'basic',
        severity: 'success',
        styles: {
          color: theme.Button.Severity.Success.Basic.successButtonTextColor,
        },
      },
      {
        variant: 'outlined',
        severity: 'success',
        styles: {
          color:
            theme.Button.Severity.Success.Outlined
              .successOutlinedButtonTextColor,
        },
      },
      {
        variant: 'text',
        severity: 'success',
        styles: {
          color: theme.Button.Severity.Success.Text.successTextButtonTextColor,
        },
      },
      {
        variant: 'basic',
        severity: 'warning',
        styles: {
          color: theme.Button.Severity.Warning.Basic.warningButtonTextColor,
        },
      },
      {
        variant: 'outlined',
        severity: 'warning',
        styles: {
          color:
            theme.Button.Severity.Warning.Outlined
              .warningOutlinedButtonTextColor,
        },
      },
      {
        variant: 'text',
        severity: 'warning',
        styles: {
          color: theme.Button.Severity.Warning.Text.warningTextButtonTextColor,
        },
      },
      {
        variant: 'basic',
        severity: 'danger',
        styles: {
          color: theme.Button.Severity.Danger.Basic.dangerButtonTextColor,
        },
      },
      {
        variant: 'outlined',
        severity: 'danger',
        styles: {
          color:
            theme.Button.Severity.Danger.Outlined.dangerOutlinedButtonTextColor,
        },
      },
      {
        variant: 'text',
        severity: 'danger',
        styles: {
          color: theme.Button.Severity.Danger.Text.dangerTextButtonTextColor,
        },
      },
    ],
  },
}))
