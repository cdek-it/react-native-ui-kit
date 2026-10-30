import type { TextStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { type MessageSeverity, severityKey } from './constants'

export const styles = StyleSheet.create(({ components, fonts, semantic }) => {
  const message = components.message

  return {
    container: (severity: MessageSeverity) => ({
      borderRadius: message.root.borderRadius,
      borderWidth: message.root.borderWidth,
      borderColor: message.colorScheme[severityKey[severity]].borderColor,
      backgroundColor: message.colorScheme[severityKey[severity]].background,
      overflow: 'hidden',
    }),
    accent: (severity: MessageSeverity) => ({
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: message.extend.extAccentLine.width - message.root.borderWidth,
      backgroundColor: message.colorScheme[severityKey[severity]].iconColor,
    }),
    content: {
      flexGrow: 1,
      // В Figma обводка внутренняя и не увеличивает отступ содержимого.
      padding: message.content.padding - message.root.borderWidth,
      gap: message.content.gap,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: message.content.gap,
    },
    titleTextContainer: {
      flex: 1,
      minWidth: 0,
      alignSelf: 'stretch',
      justifyContent: 'center',
      gap: message.extend.extText.gap,
    },
    footer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: semantic.dimension.space[200],
    },
    icon: {
      width: message.icon.size,
      height: message.icon.size,
      flexShrink: 0,
    },
    title: (severity: MessageSeverity) => ({
      color: message.colorScheme[severityKey[severity]].color,
      fontSize: message.text.fontSize,
      fontWeight: message.text.fontWeight as TextStyle['fontWeight'],
      lineHeight: fonts.lineHeight[400],
      letterSpacing: fonts.letterSpacing[500],
    }),
    caption: (severity: MessageSeverity) => ({
      color: message.colorScheme[severityKey[severity]].color,
      fontSize: message.caption.fontSize,
      fontWeight: message.caption.fontWeight as TextStyle['fontWeight'],
      lineHeight: message.caption.lineHeight,
      letterSpacing: message.caption.letterSpacing,
    }),
    closeButton: (severity: MessageSeverity) => ({
      minHeight: message.closeButton.height,
      paddingHorizontal: semantic.dimension.space[200],
      borderRadius: message.closeButton.borderRadius,
      borderWidth: message.extend.extCloseButton.width,
      borderColor:
        message.colorScheme[severityKey[severity]].closeButton.borderColor,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }),
    closeIconOnly: { width: message.closeButton.width, paddingHorizontal: 0 },
    closePressed: (severity: MessageSeverity) => ({
      backgroundColor:
        message.colorScheme[severityKey[severity]].closeButton.hoverBackground,
    }),
    closeLabel: (severity: MessageSeverity) => ({
      fontFamily: fonts.fontFamily.base,
      fontSize: message.caption.fontSize,
      lineHeight: message.caption.lineHeight,
      color: message.colorScheme[severityKey[severity]].closeButton.color,
    }),
  }
})
