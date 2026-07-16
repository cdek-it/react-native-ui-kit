/* eslint-disable max-lines, max-lines-per-function */
import { type ReactNode, useContext } from 'react'
import { Pressable, type PressableStateCallbackType } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { genericMemo } from '../../../utils/genericMemo'
import type { BaseButtonProps, ButtonShape, ButtonSize } from '../types'

import { ButtonPressedContext } from './ButtonPressedContext'
import { ButtonVariantContext } from './ButtonVariantContext'

export interface ButtonContainerComponentProps {
  readonly size: ButtonSize
  readonly shape: ButtonShape
  readonly disabled: boolean
  readonly loading: boolean
  readonly isIconOnly: boolean
  readonly style?: BaseButtonProps<never>['style']
  readonly pressableRef?: BaseButtonProps<never>['pressableRef']
  readonly children: ReactNode
  readonly onPressIn?: BaseButtonProps<never>['onPressIn']
  readonly onPressOut?: BaseButtonProps<never>['onPressOut']
  [key: string]: unknown
}

const ButtonContainerComponent = ({
  style,
  size,
  disabled,
  loading,
  shape,
  isIconOnly,
  children,
  pressableRef,
  onPressIn,
  onPressOut,
  ...props
}: ButtonContainerComponentProps) => {
  const pressed = useContext(ButtonPressedContext)
  const { variant, severity } = useContext(ButtonVariantContext)

  buttonContainerStyles.useVariants({
    size,
    shape,
    variant,
    severity,
    pressed: pressed ? 'true' : 'false',
    disabled: disabled || loading ? 'true' : 'false',
    iconOnly: isIconOnly ? 'true' : 'false',
  })

  const resolvedStyle =
    typeof style === 'function'
      ? (state: PressableStateCallbackType) => [
          buttonContainerStyles.container,
          isIconOnly && buttonContainerStyles.iconOnly,
          style(state),
        ]
      : [
          buttonContainerStyles.container,
          isIconOnly && buttonContainerStyles.iconOnly,
          ...(style ? [style] : []),
        ]

  return (
    <Pressable
      accessibilityRole='button'
      disabled={disabled || loading}
      ref={pressableRef}
      style={resolvedStyle}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      {...props}
    >
      {children}
    </Pressable>
  )
}

export const ButtonContainer = genericMemo(ButtonContainerComponent)

const buttonContainerStyles = StyleSheet.create(
  ({ theme, border, spacing, sizing }) => ({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: border.Width.border,
      variants: {
        size: {
          xlarge: {
            paddingHorizontal: theme.Button.extXlg.paddingX,
            paddingVertical: theme.Button.extXlg.paddingY,
            height: theme.Button.extXlg.height,
            minHeight: theme.Button.extXlg.height,
            maxHeight: theme.Button.extXlg.height,
            gap: theme.Button.extXlg.gap,
            borderRadius: theme.Button.extXlg.borderRadius,
          },
          large: {
            paddingHorizontal: theme.Button.lg.paddingX,
            paddingVertical: theme.Button.lg.paddingY,
            height: theme.Button.extLg.height,
            minHeight: theme.Button.extLg.height,
            maxHeight: theme.Button.extLg.height,
            gap: theme.Button.extLg.gap,
            borderRadius: theme.Button.extLg.borderRadius,
          },
          // base/sm — padding-driven: высота растёт от paddingY + fontSize + borderWidth
          base: {
            paddingHorizontal: theme.Button.paddingX,
            paddingVertical: theme.Button.paddingY,
            height: 'auto',
            gap: theme.Button.gap,
            borderRadius: theme.Button.borderRadius,
          },
          small: {
            paddingHorizontal: theme.Button.sm.paddingX,
            paddingVertical: theme.Button.sm.paddingY,
            height: 'auto',
            gap: theme.Button.extSm.gap,
            borderRadius: theme.Button.extSm.borderRadius,
          },
        },
        shape: {
          square: {},
          circle: { borderRadius: border.Radius['rounded-full'] },
        },
        variant: {
          primary: {
            borderColor: theme.Button.root.primary.borderColor,
            backgroundColor: theme.Button.root.primary.background,
          },
          secondary: {
            borderColor: theme.Button.root.secondary.borderColor,
            backgroundColor: theme.Button.root.secondary.background,
          },
          tertiary: {
            borderColor: theme.Button.root.contrast.borderColor,
            backgroundColor: theme.Button.root.contrast.background,
          },
          text: { borderColor: 'transparent', backgroundColor: 'transparent' },
          link: {
            paddingHorizontal: 0,
            paddingVertical: spacing.Padding['p-1'],
            height: 'auto',
            minHeight: 'auto',
            borderColor: 'transparent',
            backgroundColor: 'transparent',
          },
          basic: {
            borderColor: theme.Button.root.primary.borderColor,
            backgroundColor: theme.Button.root.primary.background,
          },
          outlined: {
            borderColor: theme.Button.outlined.primary.borderColor,
            backgroundColor: 'transparent',
          },
        },
        severity: { info: {}, success: {}, warning: {}, danger: {} },
        pressed: { true: {}, false: {} },
        disabled: {
          true: {
            backgroundColor: theme.Button.disabledBackground,
            borderColor: 'transparent',
          },
          false: {},
        },
        iconOnly: { true: {}, false: {} },
      },
      compoundVariants: [
        // basic button pressed
        {
          variant: 'primary',
          pressed: 'true',
          styles: {
            borderColor: theme.Button.root.primary.hoverBorderColor,
            backgroundColor: theme.Button.root.primary.hoverBackground,
          },
        },
        {
          variant: 'secondary',
          pressed: 'true',
          styles: {
            borderColor: theme.Button.root.secondary.hoverBorderColor,
            backgroundColor: theme.Button.root.secondary.hoverBackground,
          },
        },
        {
          variant: 'tertiary',
          pressed: 'true',
          styles: {
            borderColor: theme.Button.root.contrast.hoverBorderColor,
            backgroundColor: theme.Button.root.contrast.hoverBackground,
          },
        },
        {
          variant: 'text',
          pressed: 'true',
          styles: {
            borderColor: 'transparent',
            backgroundColor: theme.Button.text.primary.hoverBackground,
          },
        },
        {
          variant: 'link',
          disabled: 'true',
          styles: {
            borderColor: 'transparent',
            backgroundColor: 'transparent',
          },
        },

        // severity container (override placeholder variant styles)
        {
          variant: 'basic',
          severity: 'info',
          styles: {
            borderColor: theme.Button.root.info.borderColor,
            backgroundColor: theme.Button.root.info.background,
          },
        },
        {
          variant: 'outlined',
          severity: 'info',
          styles: {
            borderColor: theme.Button.outlined.info.borderColor,
            backgroundColor: 'transparent',
          },
        },
        {
          variant: 'text',
          severity: 'info',
          styles: {
            borderColor: 'transparent',
            backgroundColor: 'transparent',
          },
        },
        {
          variant: 'basic',
          severity: 'success',
          styles: {
            borderColor: theme.Button.root.success.borderColor,
            backgroundColor: theme.Button.root.success.background,
          },
        },
        {
          variant: 'outlined',
          severity: 'success',
          styles: {
            borderColor: theme.Button.outlined.success.borderColor,
            backgroundColor: 'transparent',
          },
        },
        {
          variant: 'text',
          severity: 'success',
          styles: {
            borderColor: 'transparent',
            backgroundColor: 'transparent',
          },
        },
        {
          variant: 'basic',
          severity: 'warning',
          styles: {
            borderColor: theme.Button.root.warn.borderColor,
            backgroundColor: theme.Button.root.warn.background,
          },
        },
        {
          variant: 'outlined',
          severity: 'warning',
          styles: {
            borderColor: theme.Button.outlined.warn.borderColor,
            backgroundColor: 'transparent',
          },
        },
        {
          variant: 'text',
          severity: 'warning',
          styles: {
            borderColor: 'transparent',
            backgroundColor: 'transparent',
          },
        },
        {
          variant: 'basic',
          severity: 'danger',
          styles: {
            borderColor: theme.Button.root.danger.borderColor,
            backgroundColor: theme.Button.root.danger.background,
          },
        },
        {
          variant: 'outlined',
          severity: 'danger',
          styles: {
            borderColor: theme.Button.outlined.danger.borderColor,
            backgroundColor: 'transparent',
          },
        },
        {
          variant: 'text',
          severity: 'danger',
          styles: {
            borderColor: 'transparent',
            backgroundColor: 'transparent',
          },
        },

        // severity pressed
        {
          variant: 'basic',
          severity: 'info',
          pressed: 'true',
          styles: {
            borderColor: theme.Button.root.info.hoverBorderColor,
            backgroundColor: theme.Button.root.info.hoverBackground,
          },
        },
        {
          variant: 'outlined',
          severity: 'info',
          pressed: 'true',
          styles: {
            borderColor: theme.Button.outlined.info.borderColor,
            backgroundColor: theme.Button.outlined.info.hoverBackground,
          },
        },
        {
          variant: 'text',
          severity: 'info',
          pressed: 'true',
          styles: {
            borderColor: 'transparent',
            backgroundColor: theme.Button.text.info.hoverBackground,
          },
        },
        {
          variant: 'basic',
          severity: 'success',
          pressed: 'true',
          styles: {
            borderColor: theme.Button.root.success.hoverBorderColor,
            backgroundColor: theme.Button.root.success.hoverBackground,
          },
        },
        {
          variant: 'outlined',
          severity: 'success',
          pressed: 'true',
          styles: {
            borderColor: theme.Button.outlined.success.borderColor,
            backgroundColor: theme.Button.outlined.success.hoverBackground,
          },
        },
        {
          variant: 'text',
          severity: 'success',
          pressed: 'true',
          styles: {
            borderColor: 'transparent',
            backgroundColor: theme.Button.text.success.hoverBackground,
          },
        },
        {
          variant: 'basic',
          severity: 'warning',
          pressed: 'true',
          styles: {
            borderColor: theme.Button.root.warn.hoverBorderColor,
            backgroundColor: theme.Button.root.warn.hoverBackground,
          },
        },
        {
          variant: 'outlined',
          severity: 'warning',
          pressed: 'true',
          styles: {
            borderColor: theme.Button.outlined.warn.borderColor,
            backgroundColor: theme.Button.outlined.warn.hoverBackground,
          },
        },
        {
          variant: 'text',
          severity: 'warning',
          pressed: 'true',
          styles: {
            borderColor: 'transparent',
            backgroundColor: theme.Button.text.warn.hoverBackground,
          },
        },
        {
          variant: 'basic',
          severity: 'danger',
          pressed: 'true',
          styles: {
            borderColor: theme.Button.root.danger.hoverBorderColor,
            backgroundColor: theme.Button.root.danger.hoverBackground,
          },
        },
        {
          variant: 'outlined',
          severity: 'danger',
          pressed: 'true',
          styles: {
            borderColor: theme.Button.outlined.danger.borderColor,
            backgroundColor: theme.Button.outlined.danger.hoverBackground,
          },
        },
        {
          variant: 'text',
          severity: 'danger',
          pressed: 'true',
          styles: {
            borderColor: 'transparent',
            backgroundColor: theme.Button.text.danger.hoverBackground,
          },
        },

        // link + iconOnly special sizes
        {
          variant: 'link',
          iconOnly: 'true',
          size: 'xlarge',
          styles: {
            paddingHorizontal: spacing.Gap['gap-1'],
            paddingVertical: spacing.Gap['gap-1'],
            height: sizing.Height['h-2'],
            minHeight: sizing.Height['h-2'],
            maxHeight: sizing.Height['h-2'],
          },
        },
        {
          variant: 'link',
          iconOnly: 'true',
          size: 'large',
          styles: {
            paddingHorizontal: spacing.Gap['gap-0'],
            paddingVertical: spacing.Gap['gap-0'],
            height: 24.5,
            minHeight: 24.5,
            maxHeight: 24.5,
          },
        },
        {
          variant: 'link',
          iconOnly: 'true',
          size: 'base',
          styles: {
            paddingHorizontal: spacing.Gap['gap-1'],
            paddingVertical: spacing.Gap['gap-1'],
            height: 21.5,
            minHeight: 21.5,
            maxHeight: 21.5,
          },
        },
        {
          variant: 'link',
          iconOnly: 'true',
          size: 'small',
          styles: {
            paddingHorizontal: spacing.Gap['gap-1'],
            paddingVertical: spacing.Gap['gap-1'],
            height: sizing.Height['h-1'],
            minHeight: sizing.Height['h-2'],
            maxHeight: sizing.Height['h-2'],
          },
        },
      ],
    },
    iconOnly: { aspectRatio: 1 },
  })
)
