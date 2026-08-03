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

// `transparent` здесь — отсутствие фона или границы, а не цвет дизайн-системы:
// прозрачность не выражена ни semantic-токеном, ни свойствами button.extend.extText.
const buttonContainerStyles = StyleSheet.create(
  ({ semantic, components: { button } }) => ({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: button.extend.borderWidth,
      variants: {
        size: {
          xlarge: {
            paddingHorizontal: button.extend.extXlg.paddingX,
            paddingVertical: button.extend.extXlg.paddingY,
            height: button.extend.extXlg.height,
            minHeight: button.extend.extXlg.height,
            maxHeight: button.extend.extXlg.height,
            gap: button.extend.extXlg.gap,
            borderRadius: button.extend.extXlg.borderRadius,
          },
          large: {
            paddingHorizontal: button.root.lg.paddingX,
            paddingVertical: button.root.lg.paddingY,
            height: button.extend.extLg.height,
            minHeight: button.extend.extLg.height,
            maxHeight: button.extend.extLg.height,
            gap: button.extend.extLg.gap,
            borderRadius: button.extend.extLg.borderRadius,
          },
          base: {
            paddingHorizontal: button.root.paddingX,
            paddingVertical: button.root.paddingY,
            height: 'auto',
            gap: button.root.gap,
            borderRadius: button.root.borderRadius,
          },
          small: {
            paddingHorizontal: button.root.sm.paddingX,
            paddingVertical: button.root.sm.paddingY,
            height: 'auto',
            gap: button.extend.extSm.gap,
            borderRadius: button.extend.extSm.borderRadius,
          },
        },
        shape: {
          square: {},
          circle: { borderRadius: button.root.roundedBorderRadius },
        },
        variant: {
          primary: {
            borderColor: button.colorScheme.root.primary.borderColor,
            backgroundColor: button.colorScheme.root.primary.background,
          },
          secondary: {
            borderColor: button.colorScheme.root.secondary.borderColor,
            backgroundColor: button.colorScheme.root.secondary.background,
          },
          tertiary: {
            borderColor: button.colorScheme.root.contrast.borderColor,
            backgroundColor: button.colorScheme.root.contrast.background,
          },
          text: { borderColor: 'transparent', backgroundColor: 'transparent' },
          link: {
            paddingHorizontal: 0,
            paddingVertical: semantic.dimension.space[100],
            height: 'auto',
            minHeight: 'auto',
            borderColor: 'transparent',
            backgroundColor: button.extend.extLink.background,
          },
          basic: {
            borderColor: button.colorScheme.root.primary.borderColor,
            backgroundColor: button.colorScheme.root.primary.background,
          },
          outlined: {
            borderColor: button.colorScheme.outlined.primary.borderColor,
            backgroundColor: 'transparent',
          },
        },
        severity: { info: {}, success: {}, warning: {}, danger: {} },
        pressed: { true: {}, false: {} },
        disabled: {
          true: {
            backgroundColor: button.extend.disabledBackground,
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
            borderColor: button.colorScheme.root.primary.hoverBorderColor,
            backgroundColor: button.colorScheme.root.primary.hoverBackground,
          },
        },
        {
          variant: 'secondary',
          pressed: 'true',
          styles: {
            borderColor: button.colorScheme.root.secondary.hoverBorderColor,
            backgroundColor: button.colorScheme.root.secondary.hoverBackground,
          },
        },
        {
          variant: 'tertiary',
          pressed: 'true',
          styles: {
            borderColor: button.colorScheme.root.contrast.hoverBorderColor,
            backgroundColor: button.colorScheme.root.contrast.hoverBackground,
          },
        },
        {
          variant: 'text',
          pressed: 'true',
          styles: {
            borderColor: 'transparent',
            backgroundColor: button.colorScheme.text.primary.hoverBackground,
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
            borderColor: button.colorScheme.root.info.borderColor,
            backgroundColor: button.colorScheme.root.info.background,
          },
        },
        {
          variant: 'outlined',
          severity: 'info',
          styles: {
            borderColor: button.colorScheme.outlined.info.borderColor,
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
            borderColor: button.colorScheme.root.success.borderColor,
            backgroundColor: button.colorScheme.root.success.background,
          },
        },
        {
          variant: 'outlined',
          severity: 'success',
          styles: {
            borderColor: button.colorScheme.outlined.success.borderColor,
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
            borderColor: button.colorScheme.root.warn.borderColor,
            backgroundColor: button.colorScheme.root.warn.background,
          },
        },
        {
          variant: 'outlined',
          severity: 'warning',
          styles: {
            borderColor: button.colorScheme.outlined.warn.borderColor,
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
            borderColor: button.colorScheme.root.danger.borderColor,
            backgroundColor: button.colorScheme.root.danger.background,
          },
        },
        {
          variant: 'outlined',
          severity: 'danger',
          styles: {
            borderColor: button.colorScheme.outlined.danger.borderColor,
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
            borderColor: button.colorScheme.root.info.hoverBorderColor,
            backgroundColor: button.colorScheme.root.info.hoverBackground,
          },
        },
        {
          variant: 'outlined',
          severity: 'info',
          pressed: 'true',
          styles: {
            borderColor: button.colorScheme.outlined.info.borderColor,
            backgroundColor: button.colorScheme.outlined.info.hoverBackground,
          },
        },
        {
          variant: 'text',
          severity: 'info',
          pressed: 'true',
          styles: {
            borderColor: 'transparent',
            backgroundColor: button.colorScheme.text.info.hoverBackground,
          },
        },
        {
          variant: 'basic',
          severity: 'success',
          pressed: 'true',
          styles: {
            borderColor: button.colorScheme.root.success.hoverBorderColor,
            backgroundColor: button.colorScheme.root.success.hoverBackground,
          },
        },
        {
          variant: 'outlined',
          severity: 'success',
          pressed: 'true',
          styles: {
            borderColor: button.colorScheme.outlined.success.borderColor,
            backgroundColor:
              button.colorScheme.outlined.success.hoverBackground,
          },
        },
        {
          variant: 'text',
          severity: 'success',
          pressed: 'true',
          styles: {
            borderColor: 'transparent',
            backgroundColor: button.colorScheme.text.success.hoverBackground,
          },
        },
        {
          variant: 'basic',
          severity: 'warning',
          pressed: 'true',
          styles: {
            borderColor: button.colorScheme.root.warn.hoverBorderColor,
            backgroundColor: button.colorScheme.root.warn.hoverBackground,
          },
        },
        {
          variant: 'outlined',
          severity: 'warning',
          pressed: 'true',
          styles: {
            borderColor: button.colorScheme.outlined.warn.borderColor,
            backgroundColor: button.colorScheme.outlined.warn.hoverBackground,
          },
        },
        {
          variant: 'text',
          severity: 'warning',
          pressed: 'true',
          styles: {
            borderColor: 'transparent',
            backgroundColor: button.colorScheme.text.warn.hoverBackground,
          },
        },
        {
          variant: 'basic',
          severity: 'danger',
          pressed: 'true',
          styles: {
            borderColor: button.colorScheme.root.danger.hoverBorderColor,
            backgroundColor: button.colorScheme.root.danger.hoverBackground,
          },
        },
        {
          variant: 'outlined',
          severity: 'danger',
          pressed: 'true',
          styles: {
            borderColor: button.colorScheme.outlined.danger.borderColor,
            backgroundColor: button.colorScheme.outlined.danger.hoverBackground,
          },
        },
        {
          variant: 'text',
          severity: 'danger',
          pressed: 'true',
          styles: {
            borderColor: 'transparent',
            backgroundColor: button.colorScheme.text.danger.hoverBackground,
          },
        },

        // link + iconOnly special sizes
        {
          variant: 'link',
          iconOnly: 'true',
          size: 'xlarge',
          styles: {
            paddingHorizontal: semantic.dimension.space[100],
            paddingVertical: semantic.dimension.space[100],
            height: 28,
            minHeight: 28,
            maxHeight: 28,
          },
        },
        {
          variant: 'link',
          iconOnly: 'true',
          size: 'large',
          styles: {
            paddingHorizontal: semantic.dimension.space.none,
            paddingVertical: semantic.dimension.space.none,
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
            paddingHorizontal: semantic.dimension.space[100],
            paddingVertical: semantic.dimension.space[100],
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
            paddingHorizontal: semantic.dimension.space[100],
            paddingVertical: semantic.dimension.space[100],
            height: 14,
            minHeight: 28,
            maxHeight: 28,
          },
        },
      ],
    },
    iconOnly: { aspectRatio: 1 },
  })
)
