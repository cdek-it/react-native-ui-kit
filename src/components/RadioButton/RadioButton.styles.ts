import { StyleSheet } from 'react-native-unistyles'

interface CircleStyleParams {
  checked: boolean
  active: boolean
  disabled: boolean
  focused: boolean
  danger: boolean
  firstLineHeight: number
}

interface CenterStyleParams {
  checked: boolean
  active: boolean
  disabled: boolean
}

export const styles = StyleSheet.create(
  ({ components: { radiobutton }, semantic, fonts }) => ({
    root: (alignToFirstLine: boolean) => ({
      flexDirection: 'row',
      alignItems: alignToFirstLine ? 'flex-start' : 'center',
      alignSelf: 'flex-start',
      flexShrink: 1,
      gap: semantic.dimension.space[300],
    }),
    circle: ({
      checked,
      active,
      disabled,
      focused,
      danger,
      firstLineHeight,
    }: CircleStyleParams) => {
      let borderColor = checked
        ? radiobutton.root.checkedBorderColor
        : radiobutton.root.borderColor

      if (disabled) {
        borderColor = checked
          ? radiobutton.root.checkedDisabledBorderColor
          : radiobutton.root.borderColor
      } else if (danger) {
        borderColor = radiobutton.root.invalidBorderColor
      } else if (focused) {
        borderColor = checked
          ? radiobutton.root.checkedFocusBorderColor
          : radiobutton.root.focusBorderColor
      } else if (active) {
        borderColor = checked
          ? radiobutton.root.checkedHoverBorderColor
          : radiobutton.root.hoverBorderColor
      }

      let backgroundColor = radiobutton.root.background

      if (disabled) {
        backgroundColor = radiobutton.root.disabledBackground
      } else if (checked && active) {
        backgroundColor = radiobutton.root.checkedHoverBackground
      } else if (checked) {
        backgroundColor = radiobutton.root.checkedBackground
      }

      return {
        width: radiobutton.root.width,
        height: radiobutton.root.height,
        marginTop: Math.max(0, (firstLineHeight - radiobutton.root.height) / 2),
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: semantic.dimension.borderRadius.max,
        borderWidth: semantic.dimension.borderWidth[100],
        borderColor,
        backgroundColor,
        transitionProperty: ['borderColor', 'backgroundColor'],
        transitionDuration: radiobutton.root.transitionDuration,
      }
    },
    center: ({ checked, active, disabled }: CenterStyleParams) => {
      let backgroundColor = radiobutton.icon.checkedColor

      if (disabled) {
        backgroundColor = radiobutton.icon.disabledColor
      } else if (active) {
        backgroundColor = radiobutton.icon.checkedHoverColor
      }

      return {
        width: radiobutton.icon.size,
        height: radiobutton.icon.size,
        borderRadius: semantic.dimension.borderRadius.max,
        opacity: checked ? 1 : 0,
        backgroundColor,
        transitionProperty: ['opacity', 'backgroundColor'],
        transitionDuration: radiobutton.root.transitionDuration,
      }
    },
    ring: (danger: boolean) => ({
      position: 'absolute',
      inset:
        -radiobutton.root.focusRing.width - semantic.dimension.borderWidth[100],
      borderRadius: semantic.dimension.borderRadius.max,
      borderWidth: radiobutton.root.focusRing.width,
      borderColor: danger
        ? semantic.colorScheme.color.border.status.danger.focus
        : radiobutton.root.focusRing.color,
    }),
    content: (firstLineHeight: number) => ({
      flexShrink: 1,
      paddingTop:
        firstLineHeight > 0
          ? Math.max(0, (radiobutton.root.height - firstLineHeight) / 2)
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
