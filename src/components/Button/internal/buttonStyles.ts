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
          height: button.extend.extXlg.height,
          gap: button.extend.extXlg.gap,
          borderRadius: button.extend.extXlg.borderRadius,
        },
        large: {
          paddingX: button.root.lg.paddingX,
          height: button.extend.extLg.height,
          gap: button.extend.extLg.gap,
          borderRadius: button.extend.extLg.borderRadius,
        },
        base: {
          paddingX: button.root.paddingX,
          height: button.root.height,
          gap: button.root.gap,
          borderRadius: button.root.borderRadius,
        },
        small: {
          paddingX: button.root.sm.paddingX,
          height: button.extend.extSm.height,
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
      const link = variant === 'link'
      const height = iconOnly
        ? link
          ? linkIconOnlyHeights[size]
          : iconOnlyHeights[size]
        : undefined
      const colors = getButtonColors(button, props)

      return {
        flexDirection: 'row' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderWidth: link
          ? semantic.dimension.space.none
          : button.extend.borderWidth,
        borderRadius: rounded
          ? button.root.roundedBorderRadius
          : sizing.borderRadius,
        paddingHorizontal:
          iconOnly || link ? semantic.dimension.space.none : sizing.paddingX,
        paddingVertical:
          link && !iconOnly
            ? button.extend.extLink.paddingY
            : semantic.dimension.space.none,
        gap: sizing.gap,
        height,
        minHeight: iconOnly ? height : link ? undefined : sizing.height,
        maxHeight: height,
        aspectRatio: iconOnly ? 1 : undefined,
      }
    },
    label: (props: Props) => {
      const sizes = {
        xlarge: {
          fontSize: button.root.lg.fontSize,
          lineHeight: fonts.lineHeight[550],
        },
        large: {
          fontSize: button.root.lg.fontSize,
          lineHeight: fonts.lineHeight[500],
        },
        base: {
          fontSize: fonts.fontSize[200],
          lineHeight: fonts.lineHeight[500],
        },
        small: {
          fontSize: button.root.sm.fontSize,
          lineHeight: fonts.lineHeight[300],
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
