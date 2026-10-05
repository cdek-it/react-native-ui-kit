import { StyleSheet } from 'react-native-unistyles'

import type { ThemeType } from '../../../theme'

import type { ButtonResolvedStyles, ButtonStyleProps } from './types'

type ButtonTokens = ThemeType['components']['button']

type ButtonColorProps = Pick<ButtonStyleProps, 'variant' | 'severity' | 'state'>

export type ButtonColorResolver<
  Props extends ButtonColorProps = ButtonColorProps,
> = (
  button: ButtonTokens,
  props: Props
) => { backgroundColor: string; borderColor: string; color: string }

const createButtonStyles = <Props extends ButtonStyleProps>(
  getButtonColors: ButtonColorResolver<Props>
) =>
  StyleSheet.create(({ components: { button }, fonts, semantic }) => ({
    container: (props: Props) => {
      const sizes = {
        xlarge: {
          paddingX: button.extend.extXlg.paddingX,
          paddingY: button.extend.extXlg.paddingY,
          height: button.extend.extXlg.height,
          gap: button.extend.extXlg.gap,
          borderRadius: button.extend.extXlg.borderRadius,
        },
        large: {
          paddingX: button.root.lg.paddingX,
          paddingY: button.root.lg.paddingY,
          height: button.extend.extLg.height,
          gap: button.extend.extLg.gap,
          borderRadius: button.extend.extLg.borderRadius,
        },
        base: {
          paddingX: button.root.paddingX,
          paddingY: button.root.paddingY,
          height: 'auto' as const,
          gap: button.root.gap,
          borderRadius: button.extend.extSm.borderRadius,
        },
        small: {
          paddingX: button.root.sm.paddingX,
          paddingY: button.root.sm.paddingY,
          height: 'auto' as const,
          gap: button.root.gap,
          borderRadius: button.root.borderRadius,
        },
      }
      const iconOnlyHeights = {
        xlarge: button.extend.extXlg.iconOnlyWidth,
        large: button.root.lg.iconOnlyWidth,
        base: button.root.iconOnlyWidth,
        small: button.root.sm.iconOnlyWidth,
      }
      const linkIconOnlyHeights = {
        xlarge: button.extend.extLink.xlg.iconOnlyWidth,
        large: button.extend.extLink.lg.iconOnlyWidth,
        base: button.extend.extLink.base.iconOnlyWidth,
        small: button.extend.extLink.sm.iconOnlyWidth,
      }
      const { size, rounded, iconOnly, variant } = props
      const sizing = sizes[size]
      const boundedHeight = sizing.height === 'auto' ? undefined : sizing.height
      const link = variant === 'link'
      const height = iconOnly
        ? link
          ? linkIconOnlyHeights[size]
          : iconOnlyHeights[size]
        : link
          ? 'auto'
          : sizing.height
      const colors = getButtonColors(button, props)

      return {
        flexDirection: 'row' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderWidth: button.extend.borderWidth,
        borderRadius: rounded
          ? button.root.roundedBorderRadius
          : sizing.borderRadius,
        paddingHorizontal:
          iconOnly || link ? semantic.dimension.space.none : sizing.paddingX,
        paddingVertical: iconOnly
          ? semantic.dimension.space.none
          : link
            ? semantic.dimension.space[100]
            : sizing.paddingY,
        gap: sizing.gap,
        height,
        minHeight: iconOnly ? height : link ? ('auto' as const) : boundedHeight,
        maxHeight: iconOnly ? height : boundedHeight,
        aspectRatio: iconOnly ? 1 : undefined,
      }
    },
    label: (props: Props) => {
      const sizes = {
        xlarge: {
          fontSize: fonts.fontSize[500],
          lineHeight: fonts.lineHeight[550],
        },
        large: {
          fontSize: fonts.fontSize[500],
          lineHeight: fonts.lineHeight[550],
        },
        base: {
          fontSize: fonts.fontSize[300],
          lineHeight: fonts.lineHeight[500],
        },
        small: {
          fontSize: fonts.fontSize[100],
          lineHeight: fonts.lineHeight[250],
        },
      }

      return {
        fontWeight: fonts.fontWeight.demibold,
        includeFontPadding: false,
        verticalAlign: 'middle' as const,
        fontFamily: fonts.fontFamily.heading,
        letterSpacing: fonts.letterSpacing[500],
        color: getButtonColors(button, props).color,
        fontSize: sizes[props.size].fontSize,
        lineHeight: sizes[props.size].lineHeight,
      }
    },
  }))

export const createButtonStyleResolver = <Props extends ButtonStyleProps>(
  getColors: ButtonColorResolver<Props>
) => {
  const styles = createButtonStyles(getColors)

  return (props: Props): ButtonResolvedStyles => ({
    container: styles.container(props),
    label: styles.label(props),
    icon: ({ components: { button } }) => {
      const dimension =
        button.extend.iconSize[
          props.size === 'small' ? 'sm' : props.size === 'base' ? 'md' : 'lg'
        ]

      return {
        color: getColors(button, props).color,
        width: dimension,
        height: dimension,
      }
    },
  })
}
