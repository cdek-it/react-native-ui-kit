import { useMemo } from 'react'

import { makeStyles } from '../../../utils/makeStyles'

import type { InputTextBaseProps } from './types'

export const useInputStyle = (size: InputTextBaseProps['size'] = 'base') => {
  const styles = useStyles()
  const containerMinHeight = useContainerMinHeight()

  const minHeight = useMemo(() => {
    if (typeof size === 'number') {
      return Math.max(size, containerMinHeight.base.minHeight)
    }

    return containerMinHeight[size].minHeight
  }, [size, containerMinHeight])

  return { ...styles, container: { ...styles.container, minHeight } }
}

const useContainerMinHeight = makeStyles(({ theme }) => ({
  base: { minHeight: theme.InputSize.base['min-height'] },
  large: { minHeight: theme.InputSize.large['min-height'] },
  xlarge: { minHeight: theme.InputSize.xlarge['min-height'] },
}))

const useStyles = makeStyles(
  ({ theme, border, typography, spacing, fonts }) => ({
    container: {
      flexDirection: 'row',
      borderWidth: border.Width.border,
      borderRadius: border.Radius['rounded-xl'],
      borderColor: theme.Form.InputText.inputBorderColor,
      backgroundColor: theme.Form.InputText.inputBg,
    },
    containerFocused: {
      outlineColor: theme.General.focusOutlineColor,
      outlineWidth: Math.round(theme.General.focusShadowWidth),
    },
    containerFloatLabel: {
      minHeight: theme.Button.Common.buttonHeightXL,
      maxHeight: theme.Button.Common.buttonHeightXL,
      height: theme.Button.Common.buttonHeightXL,
    },
    danger: { borderColor: theme.Form.InputText.inputErrorBorderColor },
    dangerFocused: { outlineColor: theme.General.focusOutlineErrorColor },
    disabled: {
      opacity: 0.6,
      borderColor: theme.Form.InputText.inputBorderColor,
      backgroundColor: theme.Button.Disabled.disabledButtonBg,
    },
    inputContainer: {
      flex: 1,
      paddingLeft: 2, // отступ для курсора
      justifyContent: 'center',
    },
    input: {
      padding: 0,
      paddingHorizontal: theme.Form.InputText.inputPaddingLeftRight,
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    inputWithRightContent: { paddingRight: 0 },
    floatLabelInput: {
      flex: 1,
      paddingHorizontal: theme.Form.InputText.inputPaddingLeftRight,
      paddingTop: 26,
      paddingBottom: 12,
      borderRadius: border.Radius['rounded-xl'],
      overflow: 'hidden',
    },
    inputFont: {
      fontSize: typography.Size['text-base'],
      color: theme.Form.InputText.inputTextColor,
      includeFontPadding: false,
      fontFamily: fonts.secondary,
      verticalAlign: 'middle',
    },
    placeholder: {
      paddingHorizontal: theme.Form.InputText.inputPaddingLeftRight,
    },
    placeholderTextColor: {
      color: theme.Form.InputText.inputPlaceholderTextColor,
    },
    rightContainer: {
      flexDirection: 'row',
      paddingHorizontal: theme.Form.InputText.inputPaddingLeftRight,
      gap: theme.Form.InputText.inputPaddingLeftRight,
      overflow: 'hidden',
      alignItems: 'center',
    },
    rightButtonContainer: { justifyContent: 'center' },
    rightIcon: { color: theme.Form.InputText.inputIconColor },
    iconSize: {
      width: typography.Size['text-base'],
      height: typography.Size['text-base'],
    },
    iconSizeFloatLabel: {
      width: typography.Size['text-xl'],
      height: typography.Size['text-xl'],
    },

    label: {
      position: 'absolute',
      left: 7,
      right: 7,
      top: 19,
      paddingVertical: 0,
      paddingLeft: spacing.Padding['p-1'],
      paddingRight: spacing.Padding['p-2'],
      color: typography.Color.Common['text-color-secondary'],
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontSize: typography.Size['text-base'],
      fontFamily: fonts.secondary,
    },
    labelReducedSize: {
      fontSize: typography.Size['text-sm'],
      paddingVertical: spacing.Padding['p-1'],
      top: 7,
      fontFamily: fonts.primary,
    },
    hidden: { opacity: 0 },
  })
)
