import { memo } from 'react'
import { Text, View, type TextStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { SvgUniversal } from '../../utils/SvgUniversal'

import { MessageCloseButton } from './MessageCloseButton'
import { MessageTimer } from './MessageTimer'
import {
  decorativeProps,
  hasMessageNode,
  severityIcons,
  severityKey,
} from './shared'
import type { MessageProps, MessageSeverity } from './types'

export type { MessageProps } from './types'

/** @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM?node-id=26608-27698 */
export const Message = memo<MessageProps>(
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
  }) => {
    const hasBody = hasMessageNode(body)
    const hasFooter = hasMessageNode(footer)
    const hasContent = Boolean(caption) || hasBody || hasFooter

    // TODO: Уточнить существует ли состояние loading или таймер с числами на месте иконки
    return (
      <View
        {...rest}
        style={[styles.container(severity), style]}
        testID={testID ?? 'MessageContainer'}
      >
        <View style={styles.header}>
          <View style={styles.heading}>
            {!hiddenIcon && (
              <View {...decorativeProps} testID='MessageIcon'>
                <SvgUniversal
                  source={Icon ?? severityIcons[severity]}
                  uniProps={({ components }) => ({
                    width: components.message.icon.size,
                    height: components.message.icon.size,
                    color:
                      components.message.colorScheme[severityKey[severity]]
                        .iconColor,
                  })}
                />
              </View>
            )}
            <Text
              ellipsizeMode='tail'
              numberOfLines={2}
              style={styles.title(severity)}
            >
              {title}
            </Text>
          </View>
          <MessageCloseButton
            closeAccessibilityLabel={closeAccessibilityLabel}
            closeLabel={closeLabel}
            kind='message'
            severity={severity}
            testID='MessageCloseButton'
            onClose={onClose}
          />
        </View>
        {hasContent ? (
          <View style={styles.content} testID='MessageContent'>
            {caption ? (
              <Text style={styles.caption(severity)}>{caption}</Text>
            ) : null}
            {hasBody ? <View testID='MessageBody'>{body}</View> : null}
            {hasFooter ? <View testID='MessageFooter'>{footer}</View> : null}
          </View>
        ) : null}
        {timerValue ? (
          <MessageTimer
            duration={timerValue}
            severity={severity}
            onFinish={onTimerFinish}
          />
        ) : null}
      </View>
    )
  }
)

const styles = StyleSheet.create(({ components, fonts }) => ({
  container: (severity: MessageSeverity) => ({
    borderRadius: components.message.root.borderRadius,
    borderWidth: components.message.root.borderWidth,
    borderColor:
      components.message.colorScheme[severityKey[severity]].borderColor,
    backgroundColor:
      components.message.colorScheme[severityKey[severity]].background,
    overflow: 'hidden',
  }),
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: components.message.content.padding,
    gap: components.message.content.gap,
  },
  heading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.message.content.iconGap,
  },
  title: (severity: MessageSeverity) => ({
    flex: 1,
    fontFamily: fonts.fontFamily.base,
    fontSize: components.message.text.fontSize,
    fontWeight: components.message.text.fontWeight as TextStyle['fontWeight'],
    lineHeight: components.message.text.lineHeight,
    color: components.message.colorScheme[severityKey[severity]].color,
  }),
  content: {
    padding: components.message.content.padding,
    gap: components.message.content.gap,
    backgroundColor: components.message.content.background,
    borderRadius: components.message.content.borderRadius,
  },
  caption: (severity: MessageSeverity) => ({
    fontFamily: fonts.fontFamily.base,
    fontSize: components.message.caption.fontSize,
    fontWeight: components.message.caption
      .fontWeight as TextStyle['fontWeight'],
    lineHeight: components.message.caption.lineHeight,
    color: components.message.colorScheme[severityKey[severity]].captionColor,
  }),
}))
