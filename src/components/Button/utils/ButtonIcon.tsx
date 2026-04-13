import { useContext } from 'react'

import { StyleSheet } from '../../../utils'
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
      height={buttonIconStyles.icon.height}
      source={Icon}
      style={buttonIconStyles.icon}
      testID='Button_Icon'
      width={buttonIconStyles.icon.width}
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
