import { IconX } from '@tabler/icons-react-native'
import { Pressable, Text } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { SvgUniversal } from '../../utils/SvgUniversal'

import { severityKey } from './shared'
import { messageStrings } from './strings'
import type { MessageProps, MessageSeverity } from './types'

interface MessageCloseButtonProps extends Pick<
  MessageProps,
  'onClose' | 'closeLabel' | 'closeAccessibilityLabel'
> {
  readonly kind: 'message' | 'toast'
  readonly severity: MessageSeverity
  readonly testID: string
}

export const MessageCloseButton = ({
  kind,
  severity,
  onClose,
  closeLabel,
  closeAccessibilityLabel,
  testID,
}: MessageCloseButtonProps) => {
  const { theme } = useUnistyles()

  if (!onClose) return null

  return (
    <Pressable
      accessibilityLabel={
        closeLabel || closeAccessibilityLabel || messageStrings.closeButton
      }
      accessibilityRole='button'
      hitSlop={theme.components[kind].closeButton.hitSlop}
      style={({ pressed }) => [
        styles.button(kind, severity),
        !closeLabel && styles.iconOnly(kind),
        pressed && styles.pressed(kind, severity),
      ]}
      testID={testID}
      onPress={() => onClose()}
    >
      {closeLabel ? (
        <Text style={styles.label(kind, severity)}>{closeLabel}</Text>
      ) : (
        <SvgUniversal
          accessible={false}
          source={IconX}
          uniProps={({ components }) => ({
            width: components[kind].closeIcon.size,
            height: components[kind].closeIcon.size,
            color:
              components[kind].colorScheme[severityKey[severity]].closeButton
                .color,
          })}
        />
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create(({ components, semantic, fonts }) => ({
  button: (kind: 'message' | 'toast', severity: MessageSeverity) => ({
    minHeight: components[kind].closeButton.height,
    paddingHorizontal: semantic.dimension.space[200],
    borderRadius: components[kind].closeButton.borderRadius,
    borderWidth:
      kind === 'toast' ? components.toast.extend.extCloseButton.width : 0,
    borderColor:
      components[kind].colorScheme[severityKey[severity]].closeButton
        .borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  iconOnly: (kind: 'message' | 'toast') => ({
    width: components[kind].closeButton.width,
    paddingHorizontal: 0,
  }),
  pressed: (kind: 'message' | 'toast', severity: MessageSeverity) => ({
    backgroundColor:
      components[kind].colorScheme[severityKey[severity]].closeButton
        .hoverBackground,
  }),
  label: (kind: 'message' | 'toast', severity: MessageSeverity) => ({
    fontFamily: fonts.fontFamily.base,
    fontSize: components[kind].caption.fontSize,
    lineHeight: components[kind].caption.lineHeight,
    color:
      components[kind].colorScheme[severityKey[severity]].closeButton.color,
  }),
}))
