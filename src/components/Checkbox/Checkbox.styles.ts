import { StyleSheet } from 'react-native-unistyles'

interface BoxStyleParams {
  filled: boolean
  active: boolean
  disabled: boolean
  focused: boolean
  danger: boolean
  firstLineHeight: number
}

export const styles = StyleSheet.create(
  ({ components: { checkbox }, semantic, fonts }) => ({
    root: (alignToFirstLine: boolean) => ({
      flexDirection: 'row',
      alignItems: alignToFirstLine ? 'flex-start' : 'center',
      alignSelf: 'flex-start',
      flexShrink: 1,
      gap: semantic.dimension.space[350],
    }),
    box: ({
      filled,
      active,
      disabled,
      focused,
      danger,
      firstLineHeight,
    }: BoxStyleParams) => {
      let borderColor = filled
        ? checkbox.root.checkedBorderColor
        : checkbox.root.borderColor

      if (disabled) {
        borderColor = checkbox.root.checkedDisabledBorderColor
      } else if (danger) {
        borderColor = checkbox.root.invalidBorderColor
      } else if (focused) {
        borderColor = filled
          ? checkbox.root.checkedFocusBorderColor
          : checkbox.root.focusBorderColor
      } else if (active) {
        borderColor = filled
          ? checkbox.root.checkedHoverBorderColor
          : checkbox.root.hoverBorderColor
      }

      let backgroundColor = checkbox.root.filledBackground

      if (disabled) {
        backgroundColor = checkbox.root.disabledBackground
      } else if (filled && active) {
        backgroundColor = checkbox.root.checkedHoverBackground
      } else if (filled) {
        backgroundColor = checkbox.root.checkedBackground
      }

      return {
        width: checkbox.root.width,
        height: checkbox.root.height,
        marginTop: Math.max(0, (firstLineHeight - checkbox.root.height) / 2),
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: checkbox.root.borderRadius,
        borderWidth: checkbox.root.extend.borderWidth,
        borderColor,
        backgroundColor,
      }
    },
    ring: (danger: boolean) => ({
      position: 'absolute',
      inset: -checkbox.root.focusRing.width - checkbox.root.extend.borderWidth,
      borderRadius: checkbox.root.borderRadius + checkbox.root.focusRing.width,
      borderWidth: checkbox.root.focusRing.width,
      borderColor: danger
        ? semantic.colorScheme.color.border.status.danger.focus
        : checkbox.root.focusRing.color,
    }),
    content: (firstLineHeight: number) => ({
      flexShrink: 1,
      paddingTop:
        firstLineHeight > 0
          ? Math.max(0, (checkbox.root.height - firstLineHeight) / 2)
          : 0,
    }),
    label: {
      fontSize: fonts.fontSize[200],
      lineHeight: fonts.lineHeight[400],
      letterSpacing: fonts.letterSpacing[500],
      color: semantic.colorScheme.color.fg.default,
    },
    caption: {
      fontSize: fonts.fontSize[200],
      lineHeight: fonts.lineHeight[300],
      letterSpacing: fonts.letterSpacing[200],
      color: semantic.colorScheme.color.fg.muted,
    },
  })
)
