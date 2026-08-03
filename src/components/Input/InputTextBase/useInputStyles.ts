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

const containerMinHeight = StyleSheet.create(({ semantic }) => ({
  base: { minHeight: semantic.dimension.size[1100] },
  large: { minHeight: semantic.dimension.size[1300] },
  xlarge: { minHeight: semantic.dimension.size[1400] },
}))

export const inputStyles = StyleSheet.create(
  ({
    primitive,
    components,
    semantic,

    fonts,
  }) => ({
    container: {
      flexDirection: 'row',
      borderWidth: semantic.dimension.borderWidth[100],
      borderRadius: components.inputtext.root.borderRadius,
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
      opacity: semantic.effects.opacity[60],
      borderColor: components.inputtext.root.borderColor,
      backgroundColor: semantic.colorScheme.color.bg.neutral.weak.disabled,
    },
    inputContainer: {
      flex: 1,
      paddingLeft: 2, // отступ для курсора
      justifyContent: 'center',
    },
    input: {
      padding: semantic.dimension.space.none,
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
      borderRadius: semantic.dimension.borderRadius[300],
      overflow: 'hidden',
    },
    inputFont: {
      fontSize: primitive.fonts.fontSize[300],
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
      width: components.inputtext.extend.iconSize,
      height: components.inputtext.extend.iconSize,
    },
    iconSizeFloatLabel: {
      width: components.inputtext.extend.iconSize,
      height: components.inputtext.extend.iconSize,
    },

    label: {
      position: 'absolute',
      left: 7,
      right: 7,
      top: 19,
      paddingVertical: semantic.dimension.space.none,
      paddingLeft: semantic.dimension.space[100],
      paddingRight: semantic.dimension.space[200],
      color: semantic.colorScheme.color.fg.muted,
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontSize: primitive.fonts.fontSize[300],
      fontFamily: fonts.secondary,
    },
    labelReducedSize: {
      fontSize: primitive.fonts.fontSize[100],
      paddingVertical: semantic.dimension.space[100],
      top: 7,
      fontFamily: fonts.primary,
    },
    hidden: { opacity: 0 },
  })
)
