import { useMemo } from 'react'

import { StyleSheet } from 'react-native-unistyles'

import type { InputTextBaseProps } from './types'

export const useInputContainerMinHeight = (
  size: InputTextBaseProps['size'] = 'base'
) => {
  const minHeight = useMemo(() => {
    if (typeof size === 'number') {
      return Math.max(size, containerMinHeight.base.minHeight)
    }

    return containerMinHeight[size].minHeight
  }, [size])

  return { minHeight }
}

// TODO(tokens-migration): reason=missing; legacy=theme.InputSize.base.min-height; value=35
// TODO(tokens-migration): reason=missing; legacy=theme.InputSize.large.min-height; value=49
// TODO(tokens-migration): reason=missing; legacy=theme.InputSize.xlarge.min-height; value=56
const containerMinHeight = StyleSheet.create(({ theme }) => ({
  base: { minHeight: theme.InputSize.base['min-height'] },
  large: { minHeight: theme.InputSize.large['min-height'] },
  xlarge: { minHeight: theme.InputSize.xlarge['min-height'] },
}))

// TODO(tokens-migration): reason=missing; legacy=components.button.extend.disabledBackground; light=#e2e2e4; dark=#404348
// TODO(tokens-migration): reason=missing; legacy=border.Width.border; value=1
// TODO(tokens-migration): reason=missing; legacy=fonts.primary; value=TT Fellows
// TODO(tokens-migration): reason=missing; legacy=fonts.secondary; value=Noto Sans
// TODO(tokens-migration): reason=missing; legacy=spacing.Padding.p-1; value=3.5
// TODO(tokens-migration): reason=missing; legacy=spacing.Padding.p-2; value=7
// TODO(tokens-migration): reason=missing; legacy=typography.Color.Common.text-color-secondary; value=#85888e
// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-sm; value=12.25
export const inputStyles = StyleSheet.create(
  ({ components, border, typography, spacing, fonts }) => ({
    container: {
      flexDirection: 'row',
      borderWidth: border.Width.border,
      // TODO(tokens-migration): reason=value-mismatch; legacy=border.Radius.rounded-xl; value=10.5; target=components.inputtext.root.borderRadius; targetValue=14
      borderRadius: border.Radius['rounded-xl'],
      borderColor: components.inputtext.root.borderColor,
      backgroundColor: components.inputtext.root.background,
    },
    containerFocused: {
      outlineColor: components.inputtext.root.focusRing.color,
      outlineWidth: components.inputtext.root.focusRing.width,
      borderColor: components.inputtext.root.focusBorderColor,
    },
    containerFloatLabel: { minHeight: 56, maxHeight: 56, height: 56 },
    danger: { borderColor: components.inputtext.root.invalidBorderColor },
    disabled: {
      opacity: 0.6,
      borderColor: components.inputtext.root.borderColor,
      backgroundColor: components.button.extend.disabledBackground,
    },
    inputContainer: {
      flex: 1,
      paddingLeft: 2, // отступ для курсора
      justifyContent: 'center',
    },
    input: {
      padding: 0,
      paddingHorizontal: components.inputtext.root.paddingX,
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    inputWithRightContent: { paddingRight: 0 },
    floatLabelInput: {
      flex: 1,
      paddingHorizontal: components.inputtext.root.paddingX,
      paddingTop: 26,
      paddingBottom: 12,
      borderRadius: border.Radius['rounded-xl'],
      overflow: 'hidden',
    },
    inputFont: {
      fontSize: typography.Size['text-base'],
      color: components.inputtext.root.color,
      includeFontPadding: false,
      fontFamily: fonts.secondary,
      verticalAlign: 'middle',
    },
    placeholder: { paddingHorizontal: components.inputtext.root.paddingX },
    placeholderTextColor: { color: components.inputtext.root.placeholderColor },
    rightContainer: {
      flexDirection: 'row',
      paddingHorizontal: components.inputtext.root.paddingX,
      gap: components.inputtext.root.paddingX,
      overflow: 'hidden',
      alignItems: 'center',
    },
    rightButtonContainer: { justifyContent: 'center' },
    iconSize: {
      // TODO(tokens-migration): reason=value-mismatch; legacy=typography.Size.text-base; value=14; target=components.inputtext.extend.iconSize; targetValue=16
      width: typography.Size['text-base'],
      height: typography.Size['text-base'],
    },
    iconSizeFloatLabel: {
      // TODO(tokens-migration): reason=value-mismatch; legacy=typography.Size.text-xl; value=17.5; target=components.inputtext.extend.iconSize; targetValue=16
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
