import type { ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

// Unistyles пересекает ViewStyle с ImageStyle, исключающим overflow: 'scroll'.
export const badgeMeasurementStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'flex-start',
  overflow: 'scroll',
}

export const badgeStyles = StyleSheet.create(
  ({ components, semantic, fonts }) => ({
    container: { alignItems: 'flex-start' },
    dot: {
      variants: {
        severity: {
          primary: {
            backgroundColor: components.badge.colorScheme.primary.background,
          },
          info: {
            backgroundColor: components.badge.extend.extDot.info.background,
          },
          success: {
            backgroundColor: components.badge.extend.extDot.success.background,
          },
          warning: {
            backgroundColor: components.badge.extend.extDot.warn.background,
          },
          danger: {
            backgroundColor: components.badge.extend.extDot.danger.background,
          },
        },
      },
    },
    dotShape: {
      width: components.badge.dot.size,
      height: components.badge.dot.size,
      borderRadius: semantic.dimension.borderRadius.max,
      borderWidth: components.overlaybadge.root.outline.width,
      borderColor: components.overlaybadge.root.outline.color,
      variants: {
        size: {
          base: {},
          large: {
            width: components.badge.extend.extDot.lg.size,
            height: components.badge.extend.extDot.lg.size,
          },
          xlarge: {
            width: components.badge.extend.extDot.xlg.size,
            height: components.badge.extend.extDot.xlg.size,
          },
        },
      },
    },
    textBadgeContainer: {
      minHeight: components.badge.root.height,
      minWidth: components.badge.root.minWidth,
      paddingHorizontal: components.badge.root.padding,
      justifyContent: 'center',
      borderRadius: components.badge.root.borderRadius,
      borderWidth: components.overlaybadge.root.outline.width,
      borderColor: components.overlaybadge.root.outline.color,
      variants: {
        severity: {
          primary: {
            backgroundColor: components.badge.colorScheme.primary.background,
          },
          info: {
            backgroundColor: components.badge.colorScheme.info.background,
          },
          success: {
            backgroundColor: components.badge.colorScheme.success.background,
          },
          warning: {
            backgroundColor: components.badge.colorScheme.warn.background,
          },
          danger: {
            backgroundColor: components.badge.colorScheme.danger.background,
          },
        },
        size: {
          base: {},
          large: {
            minHeight: components.badge.lg.height,
            minWidth: components.badge.lg.minWidth,
          },
          xlarge: {
            minHeight: components.badge.xl.height,
            minWidth: components.badge.xl.minWidth,
          },
        },
      },
    },
    textBadge: {
      color: components.badge.colorScheme.primary.color,
      fontSize: components.badge.root.fontSize,
      fontWeight: fonts.fontWeight.regular,
      textAlign: 'center',
      letterSpacing: fonts.letterSpacing[500],
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontFamily: fonts.fontFamily.heading,
      variants: {
        severity: {
          primary: { color: components.badge.colorScheme.primary.color },
          info: { color: components.badge.colorScheme.info.color },
          success: { color: components.badge.colorScheme.success.color },
          warning: { color: components.badge.colorScheme.warn.color },
          danger: { color: components.badge.colorScheme.danger.color },
        },
        size: {
          base: {},
          large: {},
          xlarge: { lineHeight: fonts.lineHeight[350] },
        },
      },
    },
  })
)
