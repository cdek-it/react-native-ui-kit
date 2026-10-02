import { useContext } from 'react'

import { StyleSheet } from 'react-native-unistyles'

import { SvgUniversal } from '../../../../utils/SvgUniversal'
import { genericMemo } from '../../../../utils/genericMemo'
import type { BaseButtonProps, ButtonSize } from '../../types'

import { ButtonPressedContext } from '../contexts/ButtonPressedContext'
import { ButtonVariantContext } from '../contexts/ButtonVariantContext'

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
      source={Icon}
      testID='Button_Icon'
      uniProps={() => ({
        color: buttonIconStyles.icon.color,
        height: buttonIconStyles.icon.height,
        width: buttonIconStyles.icon.width,
      })}
    />
  )
}

export const ButtonIcon = genericMemo(ButtonIconComponent)

const buttonIconStyles = StyleSheet.create(({ components: { button } }) => ({
  icon: {
    variants: {
      size: {
        xlarge: {
          height: button.extend.iconSize.lg,
          width: button.extend.iconSize.lg,
        },
        large: {
          height: button.extend.iconSize.lg,
          width: button.extend.iconSize.lg,
        },
        base: {
          height: button.extend.iconSize.md,
          width: button.extend.iconSize.md,
        },
        small: {
          height: button.extend.iconSize.sm,
          width: button.extend.iconSize.sm,
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

      // severity icon colors
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
}))
