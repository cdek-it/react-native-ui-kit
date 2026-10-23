import { StyleSheet } from 'react-native-unistyles'

import type { InputTextSize } from './types'

export const styles = StyleSheet.create(({ components, semantic, fonts }) => ({
  root: { gap: semantic.dimension.space[100] },
  frame: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: components.inputtext.extend.borderWidth,
    borderRadius: components.inputtext.root.borderRadius,
    borderColor: components.inputtext.root.borderColor,
    backgroundColor: components.inputtext.root.background,
  },
  floatingFrame: (fontScale: number) => ({
    minHeight: semantic.dimension.size[1300],
    height: fontScale <= 1 ? semantic.dimension.size[1300] : undefined,
    borderRadius: semantic.dimension.borderRadius[400],
  }),
  filled: { backgroundColor: components.inputtext.root.filledBackground },
  filledFocused: {
    backgroundColor: components.inputtext.root.filledFocusBackground,
  },
  focused: {
    borderColor: components.inputtext.root.focusBorderColor,
    outlineWidth: components.inputtext.root.focusRing.width,
    outlineColor: components.inputtext.root.focusRing.color,
  },
  // Обрезка на отдельном View сохраняет first responder при смене outline на iOS.
  frameClip: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
    borderRadius:
      components.inputtext.root.borderRadius -
      components.inputtext.extend.borderWidth,
  },
  floatingFrameClip: {
    borderRadius:
      semantic.dimension.borderRadius[400] -
      components.inputtext.extend.borderWidth,
  },
  danger: { borderColor: components.inputtext.root.invalidBorderColor },
  dangerFocused: {
    outlineColor: components.inputtext.extend.invalidFocusRing.color,
  },
  readOnly: { backgroundColor: components.inputtext.extend.readonlyBackground },
  disabled: { backgroundColor: components.inputtext.root.disabledBackground },
  disabledText: { color: components.inputtext.root.disabledColor },
  control: { flex: 1, minWidth: 0, flexDirection: 'row' },
  inputContainer: { flex: 1, minWidth: 0, justifyContent: 'center' },
  floatingInputContainer: { alignSelf: 'center' },
  placeholder: { position: 'absolute', left: 0, right: 0 },
  placeholderText: { color: components.inputtext.root.placeholderColor },
  dangerPlaceholder: {
    color: components.inputtext.root.invalidPlaceholderColor,
  },
  hidden: { opacity: 0 },
  input: {
    fontFamily: fonts.fontFamily.base,
    color: components.inputtext.root.color,
    includeFontPadding: false,
    verticalAlign: 'middle',
    padding: semantic.dimension.space.none,
  },
  inputWithActions: { paddingRight: semantic.dimension.space.none },
  small: {
    fontSize: components.inputtext.root.sm.fontSize,
    paddingHorizontal: components.inputtext.root.sm.paddingX,
    paddingVertical: components.inputtext.root.sm.paddingY,
  },
  base: {
    fontSize: fonts.fontSize[300],
    paddingHorizontal: components.inputtext.root.paddingX,
    paddingVertical: components.inputtext.root.paddingY,
  },
  large: {
    fontSize: components.inputtext.root.lg.fontSize,
    paddingHorizontal: components.inputtext.root.lg.paddingX,
    paddingVertical: components.inputtext.root.lg.paddingY,
  },
  xlarge: {
    fontSize: components.inputtext.extend.extXlg.fontSize,
    paddingHorizontal: components.inputtext.extend.extXlg.paddingX,
    paddingVertical: components.inputtext.extend.extXlg.paddingY,
  },
  floatInput: {
    fontSize: fonts.fontSize[200],
    fontWeight: fonts.fontWeight.regular,
    lineHeight: fonts.lineHeight[200],
    paddingHorizontal: semantic.dimension.space[350],
    paddingTop: semantic.dimension.space[300] + fonts.lineHeight[200],
    paddingBottom: components.floatlabel.inside.input.paddingBottom,
  },
  label: {
    fontFamily: fonts.fontFamily.base,
    fontSize: fonts.fontSize[200],
    fontWeight: fonts.fontWeight.regular,
    lineHeight: fonts.lineHeight[400],
    letterSpacing: fonts.letterSpacing[500],
    color: semantic.colorScheme.color.fg.default,
    flexShrink: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: semantic.dimension.space[100],
  },
  labelInfo: {
    width: semantic.dimension.size[700],
    height: semantic.dimension.size[700],
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Color/Service/text-danger из Figma соответствует strong-цвету ошибки в обеих темах
  required: { color: semantic.colorScheme.color.border.status.danger.strong },
  labelRequired: { fontSize: fonts.fontSize[300] },
  floatLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: semantic.dimension.space[50],
    position: 'absolute',
    top: components.floatlabel.root.positionY,
    paddingVertical: semantic.dimension.space.none,
  },
  floatText: (isDanger: boolean, isRequired = false) => ({
    fontSize: fonts.fontSize[200],
    lineHeight: fonts.lineHeight[400],
    fontFamily: fonts.fontFamily.base,
    color:
      isDanger || isRequired
        ? components.floatlabel.root.invalidColor
        : components.floatlabel.root.color,
    includeFontPadding: false,
    flexShrink: 1,
  }),
  floatReduced: {
    top: semantic.dimension.space[300],
    paddingVertical: semantic.dimension.space.none,
    fontSize: components.floatlabel.root.active.fontSize,
    lineHeight: fonts.lineHeight[200],
    fontFamily: fonts.fontFamily.base,
  },
  floatLabelInfo: {
    width: semantic.dimension.size[400],
    height: semantic.dimension.size[400],
  },
  actions: (size: InputTextSize = 'base', floating = false) => ({
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingLeft: semantic.dimension.space[100],
    paddingRight: floating
      ? semantic.dimension.space[350]
      : {
          small: components.inputtext.root.sm.paddingX,
          base: components.inputtext.root.paddingX,
          large: components.inputtext.root.lg.paddingX,
          xlarge: components.inputtext.extend.extXlg.paddingX,
        }[size],
    gap: semantic.dimension.space[100],
  }),
  action: { justifyContent: 'center', alignItems: 'center' },
  icon: (size: InputTextSize = 'base', floating = false) => {
    const iconSize = floating
      ? semantic.dimension.size[450]
      : {
          small: semantic.dimension.size[400],
          base: components.inputtext.extend.iconSize,
          large: semantic.dimension.size[500],
          xlarge: semantic.dimension.size[600],
        }[size]

    return { width: iconSize, height: iconSize }
  },
}))
