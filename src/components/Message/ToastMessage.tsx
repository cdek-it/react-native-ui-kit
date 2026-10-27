import { memo } from 'react'
import { Text, View, type TextStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { SvgUniversal } from '../../utils/SvgUniversal'

import { MessageCloseButton } from './MessageCloseButton'
import { ToastMessageTimer } from './MessageTimer'
import {
  decorativeProps,
  hasMessageNode,
  severityIcons,
  severityKey,
} from './shared'
import type { MessageSeverity, ToastMessageProps } from './types'

export type { ToastMessageProps } from './types'

/** @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM?node-id=15953-4567 */
export const ToastMessage = memo<ToastMessageProps>(
  ({
    title,
    caption,
    body,
    footer,
    severity = 'info',
    Icon,
    hiddenIcon = false,
    onClose,
    closeLabel,
    closeAccessibilityLabel,
    timerValue,
    onTimerFinish,
    style,
    testID,
    ...rest
  }) => (
    <View
      {...rest}
      style={[styles.container(severity), style]}
      testID={testID ?? 'ToastMessageContainer'}
    >
      <View style={styles.content(severity)}>
        <View style={styles.header}>
          {timerValue ? (
            <ToastMessageTimer
              duration={timerValue}
              severity={severity}
              onFinish={onTimerFinish}
            />
          ) : (
            !hiddenIcon && (
              <View {...decorativeProps} testID='ToastMessageIcon'>
                <SvgUniversal
                  source={Icon ?? severityIcons[severity]}
                  uniProps={({ components }) => ({
                    width: components.toast.icon.size,
                    height: components.toast.icon.size,
                    color:
                      components.toast.colorScheme[severityKey[severity]]
                        .iconColor,
                  })}
                />
              </View>
            )
          )}
          <View style={styles.text}>
            <Text style={styles.title(severity)}>{title}</Text>
            {caption ? (
              <Text style={styles.caption(severity)}>{caption}</Text>
            ) : null}
          </View>
          <MessageCloseButton
            closeAccessibilityLabel={closeAccessibilityLabel}
            closeLabel={closeLabel}
            kind='toast'
            severity={severity}
            testID='ToastMessageCloseButton'
            onClose={onClose}
          />
        </View>
        {hasMessageNode(body) && <View testID='ToastMessageBody'>{body}</View>}
        {hasMessageNode(footer) && (
          <View testID='ToastMessageFooter'>{footer}</View>
        )}
      </View>
    </View>
  )
)

const styles = StyleSheet.create(({ components, fonts }) => ({
  container: (severity: MessageSeverity) => ({
    borderRadius: components.toast.root.borderRadius,
    borderWidth: components.toast.root.borderWidth,
    borderColor:
      components.toast.colorScheme[severityKey[severity]].borderColor,
    backgroundColor:
      components.toast.colorScheme[severityKey[severity]].background,
    boxShadow: components.toast.colorScheme[severityKey[severity]].shadow,
  }),
  content: (severity: MessageSeverity) => ({
    borderLeftWidth:
      components.toast.extend.extAccentLine.width -
      components.toast.root.borderWidth,
    borderColor:
      components.toast.colorScheme[severityKey[severity]].borderColor,
    padding: components.toast.content.padding,
    gap: components.toast.content.gap,
    borderRadius: components.toast.root.borderRadius,
    overflow: 'hidden',
  }),
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: components.toast.content.gap,
  },
  text: { flex: 1, alignSelf: 'center', gap: components.toast.text.gap },
  title: (severity: MessageSeverity) => ({
    fontFamily: fonts.fontFamily.base,
    fontSize: components.toast.summary.fontSize,
    fontWeight: components.toast.summary.fontWeight as TextStyle['fontWeight'],
    lineHeight: components.toast.text.lineHeight,
    color: components.toast.colorScheme[severityKey[severity]].color,
  }),
  caption: (severity: MessageSeverity) => ({
    fontFamily: fonts.fontFamily.base,
    fontSize: components.toast.detail.fontSize,
    fontWeight: components.toast.detail.fontWeight as TextStyle['fontWeight'],
    lineHeight: components.toast.caption.lineHeight,
    color: components.toast.colorScheme[severityKey[severity]].detailColor,
  }),
}))
