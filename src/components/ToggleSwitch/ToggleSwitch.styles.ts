import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create(
  ({ components: { toggleswitch }, semantic, fonts }) => ({
    root: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      flexShrink: 1,
      gap: semantic.dimension.space[350],
      minHeight: 44,
      minWidth: 44,
    },
    track: (
      checked: boolean,
      active: boolean,
      disabled: boolean,
      focused: boolean
    ) => ({
      width: toggleswitch.root.width,
      height: toggleswitch.root.height,
      flexShrink: 0,
      borderRadius: toggleswitch.root.borderRadius,
      borderWidth: toggleswitch.root.borderWidth,
      borderColor:
        focused && !disabled
          ? semantic.colorScheme.color.border.neutral.strong
          : checked
            ? active && !disabled
              ? toggleswitch.root.checkedHoverBorderColor
              : toggleswitch.root.checkedBorderColor
            : active && !disabled
              ? toggleswitch.root.hoverBorderColor
              : toggleswitch.root.borderColor,
      backgroundColor: disabled
        ? toggleswitch.colorScheme.root.disabledBackground
        : checked
          ? active
            ? toggleswitch.colorScheme.root.checkedHoverBackground
            : toggleswitch.colorScheme.root.checkedBackground
          : active
            ? toggleswitch.colorScheme.root.hoverBackground
            : toggleswitch.colorScheme.root.background,
    }),
    handle: (checked: boolean, active: boolean, disabled: boolean) => ({
      position: 'absolute',
      top: toggleswitch.root.gap - toggleswitch.root.borderWidth,
      left: toggleswitch.root.gap - toggleswitch.root.borderWidth,
      width: toggleswitch.handle.size,
      height: toggleswitch.handle.size,
      borderRadius: toggleswitch.handle.borderRadius,
      backgroundColor: disabled
        ? toggleswitch.colorScheme.handle.disabledBackground
        : checked
          ? active
            ? toggleswitch.colorScheme.handle.checkedHoverBackground
            : toggleswitch.colorScheme.handle.checkedBackground
          : active
            ? toggleswitch.colorScheme.handle.hoverBackground
            : toggleswitch.colorScheme.handle.background,
    }),
    ring: (danger: boolean) => ({
      position: 'absolute',
      inset:
        -semantic.dimension.focusRing.width - toggleswitch.root.borderWidth,
      borderRadius:
        toggleswitch.root.borderRadius + semantic.dimension.focusRing.width,
      borderWidth: semantic.dimension.focusRing.width,
      borderColor: danger
        ? semantic.colorScheme.color.border.status.danger.focus
        : semantic.colorScheme.color.border.neutral.focus,
    }),
    content: { flexShrink: 1 },
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
