import { useCallback } from 'react'
import {
  type PressableStateCallbackType,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native'

import { makeStyles } from '../../../utils/makeStyles'
import type { BaseButtonProps } from '../types'

import { useButtonPressedStyle } from './useButtonPressedStyle'
import { useTypeBasedStyle } from './useTypeBasedStyle'

export const useButtonContainerCallbackStyle = (
  size: Required<BaseButtonProps>['size'],
  variant: Required<BaseButtonProps>['variant'],
  shape: Required<BaseButtonProps>['shape'],
  disabled: Required<BaseButtonProps>['disabled'],
  loading: Required<BaseButtonProps>['loading'],
  iconOnly: Required<BaseButtonProps>['iconOnly'],
  style: BaseButtonProps['style']
) => {
  const styles = useButtonContainerStyle()

  const sizeBasedStyle = useTypeBasedStyle(size, styles)
  const variantBasedStyle = useTypeBasedStyle(variant, styles)
  const shapeBasedStyle = useTypeBasedStyle(shape, styles)
  const pressedStyle = useButtonPressedStyle(variant)

  return useCallback(
    ({ pressed }: PressableStateCallbackType) => {
      const containerStyle: Array<StyleProp<ViewStyle>> = [
        styles.container,
        sizeBasedStyle,
        variantBasedStyle,
        shapeBasedStyle,
      ]

      if (iconOnly) {
        containerStyle.push(styles.iconOnly)
      }

      if (disabled || loading) {
        containerStyle.push(styles.disabled)
      }

      if (pressed) {
        containerStyle.push(pressedStyle)
      }

      if (typeof style === 'function') {
        containerStyle.push(style({ pressed }))
      } else {
        containerStyle.push(style)
      }

      return StyleSheet.flatten(containerStyle)
    },
    [
      disabled,
      iconOnly,
      loading,
      pressedStyle,
      shapeBasedStyle,
      sizeBasedStyle,
      style,
      styles.container,
      styles.disabled,
      styles.iconOnly,
      variantBasedStyle,
    ]
  )
}

const useButtonContainerStyle = makeStyles(({ theme, border }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: border.Width['border-1'],
  },

  xlarge: {
    paddingHorizontal: 21,
    paddingVertical: theme.Button.Common.buttonPaddingTopBottom,
    height: theme.Button.Common.buttonHeightXL,
    minHeight: theme.Button.Common.buttonHeightXL,
    maxHeight: theme.Button.Common.buttonHeightXL,
    gap: 10.5,
  },

  large: {
    paddingHorizontal: 21,
    paddingVertical: theme.Button.Common.buttonPaddingTopBottom,
    height: theme.Button.Common.buttonHeightLG,
    minHeight: theme.Button.Common.buttonHeightLG,
    maxHeight: theme.Button.Common.buttonHeightLG,
    gap: 10.5,
  },

  base: {
    paddingHorizontal: theme.Button.Common.buttonPaddingLeftRight,
    paddingVertical: theme.Button.Common.buttonPaddingTopBottom,
    height: theme.Button.Common.buttonHeight,
    minHeight: theme.Button.Common.buttonHeight,
    maxHeight: theme.Button.Common.buttonHeight,
    gap: theme.General.inlineSpacing,
  },

  small: {
    paddingHorizontal: 10.5,
    paddingVertical: theme.Button.Common.buttonPaddingTopBottom,
    height: theme.Button.Common.buttonHeightSM,
    minHeight: theme.Button.Common.buttonHeightSM,
    maxHeight: theme.Button.Common.buttonHeightSM,
    gap: theme.General.inlineSpacing,
  },

  basic: {
    borderColor: theme.Button.Basic.buttonBorderColor,
    backgroundColor: theme.Button.Basic.buttonBg,
  },

  outlined: {
    borderColor: theme.Button.Outlined.outlinedButtonBorderColor,
    backgroundColor: theme.Button.Outlined.outlinedButtonBg,
  },

  text: {
    borderColor: theme.Button.Basic.buttonBorderColor,
    backgroundColor: theme.Button.Text.textButtonBg,
  },

  square: {
    borderRadius: theme.General.borderRadius,
  },

  circle: {
    borderRadius: border.Radius['border-circle'],
  },

  disabled: {
    backgroundColor: theme.Button.Disabled.disabledButtonBg,
    borderColor: theme.Button.Disabled.disabledButtonBorderColor,
  },

  iconOnly: {
    aspectRatio: 1,
  },
}))
