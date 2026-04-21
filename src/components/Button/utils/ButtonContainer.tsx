import { type ReactNode, useContext } from 'react'
import { Pressable, type PressableStateCallbackType } from 'react-native'

import { StyleSheet } from '../../../utils'
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
            paddingHorizontal: spacing.Padding['p-6'],
            paddingVertical: theme.Button.Common.buttonPaddingTopBottom,
            height: theme.Button.Common.buttonHeightXL,
            minHeight: theme.Button.Common.buttonHeightXL,
            maxHeight: theme.Button.Common.buttonHeightXL,
            gap: spacing.Gap['gap-3'],
            borderRadius: theme.General.borderRadius2XL,
          },
          large: {
            paddingHorizontal: spacing.Padding['p-6'],
            paddingVertical: theme.Button.Common.buttonPaddingTopBottom,
            height: theme.Button.Common.buttonHeightLG,
            minHeight: theme.Button.Common.buttonHeightLG,
            maxHeight: theme.Button.Common.buttonHeightLG,
            gap: spacing.Gap['gap-3'],
            borderRadius: theme.General.borderRadius2XL,
          },
          base: {
            paddingHorizontal: theme.Button.Common.buttonPaddingLeftRight,
            paddingVertical: theme.Button.Common.buttonPaddingTopBottom,
            height: theme.Button.Common.buttonHeight,
            minHeight: theme.Button.Common.buttonHeight,
            maxHeight: theme.Button.Common.buttonHeight,
            gap: theme.General.inlineSpacing,
            borderRadius: theme.General.borderRadiusXL,
          },
          small: {
            paddingHorizontal: spacing.Padding['p-3'],
            paddingVertical: theme.Button.Common.buttonPaddingTopBottom,
            height: theme.Button.Common.buttonHeightSM,
            minHeight: theme.Button.Common.buttonHeightSM,
            maxHeight: theme.Button.Common.buttonHeightSM,
            gap: theme.General.inlineSpacing,
            borderRadius: theme.General.borderRadiusXL,
          },
        },
        shape: {
          square: {},
          circle: { borderRadius: border.Radius['rounded-full'] },
        },
        variant: {
          primary: {
            borderColor: theme.Button.Brand.buttonBorderColor,
            backgroundColor: theme.Button.Brand.buttonBg,
          },
          secondary: {
            borderColor: theme.Button.Primary.secondaryButtonBorderColor,
            backgroundColor: theme.Button.Primary.secondaryButtonBg,
          },
          tertiary: {
            borderColor: theme.Button.Secondary.helpButtonBorderColor,
            backgroundColor: theme.Button.Secondary.helpButtonBg,
          },
          text: {
            borderColor: theme.Button.Brand.buttonBorderColor,
            backgroundColor: theme.Button.Text.textButtonBg,
          },
          link: {
            paddingHorizontal: 0,
            paddingVertical: spacing.Padding['p-1'],
            height: 'auto',
            minHeight: 'auto',
            borderColor: theme.Button.Brand.buttonBorderColor,
            backgroundColor: theme.Button.Text.textButtonBg,
          },
          basic: {
            borderColor: theme.Button.Brand.buttonBorderColor,
            backgroundColor: theme.Button.Brand.buttonBg,
          },
          outlined: {
            borderColor: theme.Button.Brand.buttonBorderColor,
            backgroundColor: theme.Button.Text.textButtonBg,
          },
        },
        severity: { info: {}, success: {}, warning: {}, danger: {} },
        pressed: { true: {}, false: {} },
        disabled: {
          true: {
            backgroundColor: theme.Button.Disabled.disabledButtonBg,
            borderColor: theme.Button.Disabled.disabledButtonBorderColor,
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
            borderColor: theme.Button.Brand.buttonBorderColor,
            backgroundColor: theme.Button.Brand.buttonHoverBg,
          },
        },
        {
          variant: 'secondary',
          pressed: 'true',
          styles: {
            borderColor: theme.Button.Primary.secondaryButtonHoverBorderColor,
            backgroundColor: theme.Button.Primary.secondaryButtonHoverBg,
          },
        },
        {
          variant: 'tertiary',
          pressed: 'true',
          styles: {
            borderColor: theme.Button.Secondary.helpButtonHoverBorderColor,
            backgroundColor: theme.Button.Secondary.helpButtonHoverBg,
          },
        },
        {
          variant: 'text',
          pressed: 'true',
          styles: {
            borderColor: theme.Button.Brand.buttonBorderColor,
            backgroundColor: theme.Button.Text.textButtonHoverBg,
          },
        },

        // severity container (override placeholder variant styles)
        {
          variant: 'basic',
          severity: 'info',
          styles: {
            borderColor: theme.Button.Severity.Info.Basic.infoButtonBorderColor,
            backgroundColor: theme.Button.Severity.Info.Basic.infoButtonBg,
          },
        },
        {
          variant: 'outlined',
          severity: 'info',
          styles: {
            borderColor:
              theme.Button.Severity.Info.Outlined.infoOutlinedButtonBorderColor,
            backgroundColor:
              theme.Button.Severity.Info.Outlined.infoOutlinedButtonBg,
          },
        },
        {
          variant: 'text',
          severity: 'info',
          styles: {
            borderColor: theme.Button.Severity.Info.Basic.infoButtonBorderColor,
            backgroundColor: theme.Button.Severity.Info.Text.infoTextButtonBg,
          },
        },
        {
          variant: 'basic',
          severity: 'success',
          styles: {
            borderColor:
              theme.Button.Severity.Success.Basic.successButtonBorderColor,
            backgroundColor:
              theme.Button.Severity.Success.Basic.successButtonBg,
          },
        },
        {
          variant: 'outlined',
          severity: 'success',
          styles: {
            borderColor:
              theme.Button.Severity.Success.Outlined
                .successOutlinedButtonBorderColor,
            backgroundColor:
              theme.Button.Severity.Success.Outlined.successOutlinedButtonBg,
          },
        },
        {
          variant: 'text',
          severity: 'success',
          styles: {
            borderColor:
              theme.Button.Severity.Success.Basic.successButtonBorderColor,
            backgroundColor:
              theme.Button.Severity.Success.Text.successTextButtonBg,
          },
        },
        {
          variant: 'basic',
          severity: 'warning',
          styles: {
            borderColor:
              theme.Button.Severity.Warning.Basic.warningButtonBorderColor,
            backgroundColor:
              theme.Button.Severity.Warning.Basic.warningButtonBg,
          },
        },
        {
          variant: 'outlined',
          severity: 'warning',
          styles: {
            borderColor:
              theme.Button.Severity.Warning.Outlined
                .warningOutlinedButtonBorderColor,
            backgroundColor:
              theme.Button.Severity.Warning.Outlined.warningOutlinedButtonBg,
          },
        },
        {
          variant: 'text',
          severity: 'warning',
          styles: {
            borderColor:
              theme.Button.Severity.Warning.Basic.warningButtonBorderColor,
            backgroundColor:
              theme.Button.Severity.Warning.Text.warningTextButtonBg,
          },
        },
        {
          variant: 'basic',
          severity: 'danger',
          styles: {
            borderColor:
              theme.Button.Severity.Danger.Basic.dangerButtonBorderColor,
            backgroundColor: theme.Button.Severity.Danger.Basic.dangerButtonBg,
          },
        },
        {
          variant: 'outlined',
          severity: 'danger',
          styles: {
            borderColor:
              theme.Button.Severity.Danger.Outlined
                .dangerOutlinedButtonBorderColor,
            backgroundColor:
              theme.Button.Severity.Danger.Outlined.dangerOutlinedButtonBg,
          },
        },
        {
          variant: 'text',
          severity: 'danger',
          styles: {
            borderColor:
              theme.Button.Severity.Danger.Basic.dangerButtonBorderColor,
            backgroundColor:
              theme.Button.Severity.Danger.Text.dangerTextButtonBg,
          },
        },

        // severity pressed
        {
          variant: 'basic',
          severity: 'info',
          pressed: 'true',
          styles: {
            borderColor: theme.Button.Severity.Info.Basic.infoButtonBorderColor,
            backgroundColor: theme.Button.Severity.Info.Basic.infoButtonHoverBg,
          },
        },
        {
          variant: 'outlined',
          severity: 'info',
          pressed: 'true',
          styles: {
            borderColor:
              theme.Button.Severity.Info.Outlined
                .infoOutlinedButtonHoverBorderColor,
            backgroundColor:
              theme.Button.Severity.Info.Outlined.infoOutlinedButtonHoverBg,
          },
        },
        {
          variant: 'text',
          severity: 'info',
          pressed: 'true',
          styles: {
            borderColor: theme.Surface['surface-transparent'],
            backgroundColor:
              theme.Button.Severity.Info.Text.infoTextButtonHoverBg,
          },
        },
        {
          variant: 'basic',
          severity: 'success',
          pressed: 'true',
          styles: {
            borderColor:
              theme.Button.Severity.Success.Basic.successButtonBorderColor,
            backgroundColor:
              theme.Button.Severity.Success.Basic.successButtonHoverBg,
          },
        },
        {
          variant: 'outlined',
          severity: 'success',
          pressed: 'true',
          styles: {
            borderColor:
              theme.Button.Severity.Success.Outlined
                .successOutlinedButtonHoverBorderColor,
            backgroundColor:
              theme.Button.Severity.Success.Outlined
                .successOutlinedButtonHoverBg,
          },
        },
        {
          variant: 'text',
          severity: 'success',
          pressed: 'true',
          styles: {
            borderColor: theme.Surface['surface-transparent'],
            backgroundColor:
              theme.Button.Severity.Success.Text.successTextButtonHoverBg,
          },
        },
        {
          variant: 'basic',
          severity: 'warning',
          pressed: 'true',
          styles: {
            borderColor:
              theme.Button.Severity.Warning.Basic.warningButtonBorderColor,
            backgroundColor:
              theme.Button.Severity.Warning.Basic.warningButtonHoverBg,
          },
        },
        {
          variant: 'outlined',
          severity: 'warning',
          pressed: 'true',
          styles: {
            borderColor:
              theme.Button.Severity.Warning.Outlined
                .warningOutlinedButtonHoverBorderColor,
            backgroundColor:
              theme.Button.Severity.Warning.Outlined
                .warningOutlinedButtonHoverBg,
          },
        },
        {
          variant: 'text',
          severity: 'warning',
          pressed: 'true',
          styles: {
            borderColor: theme.Surface['surface-transparent'],
            backgroundColor:
              theme.Button.Severity.Warning.Text.warningTextButtonHoverBg,
          },
        },
        {
          variant: 'basic',
          severity: 'danger',
          pressed: 'true',
          styles: {
            borderColor:
              theme.Button.Severity.Danger.Basic.dangerButtonBorderColor,
            backgroundColor:
              theme.Button.Severity.Danger.Basic.dangerButtonHoverBg,
          },
        },
        {
          variant: 'outlined',
          severity: 'danger',
          pressed: 'true',
          styles: {
            borderColor:
              theme.Button.Severity.Danger.Outlined
                .dangerOutlinedButtonHoverBorderColor,
            backgroundColor:
              theme.Button.Severity.Danger.Outlined.dangerOutlinedButtonHoverBg,
          },
        },
        {
          variant: 'text',
          severity: 'danger',
          pressed: 'true',
          styles: {
            borderColor: theme.Surface['surface-transparent'],
            backgroundColor:
              theme.Button.Severity.Danger.Text.dangerTextButtonHoverBg,
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
