import { IconX } from '@tabler/icons-react-native'
import { Pressable, Text } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'

import { SvgUniversal } from '../../utils/SvgUniversal'

import type { MessageProps } from './Message'
import { styles } from './Message.styles'
import { type MessageSeverity, severityKey } from './constants'
import { MESSAGE_CLOSE_ACCESSIBILITY_LABEL } from './strings'
import { TestId } from './testIds'

interface MessageCloseButtonProps extends Pick<
  MessageProps,
  'onClose' | 'closeLabel' | 'closeAccessibilityLabel'
> {
  readonly severity: MessageSeverity
}

export const MessageCloseButton = ({
  onClose,
  closeLabel,
  closeAccessibilityLabel,
  severity,
}: MessageCloseButtonProps) => {
  const { theme } = useUnistyles()

  if (!onClose) return null

  return (
    <Pressable
      accessibilityLabel={
        closeLabel ||
        closeAccessibilityLabel ||
        MESSAGE_CLOSE_ACCESSIBILITY_LABEL
      }
      accessibilityRole='button'
      hitSlop={theme.components.message.closeButton.hitSlop}
      style={({ pressed }) => [
        styles.closeButton(severity),
        !closeLabel && styles.closeIconOnly,
        pressed && styles.closePressed(severity),
      ]}
      testID={TestId.CloseButton}
      onPress={() => onClose()}
    >
      {closeLabel ? (
        <Text style={styles.closeLabel(severity)}>{closeLabel}</Text>
      ) : (
        <SvgUniversal
          accessible={false}
          source={IconX}
          uniProps={({ components }) => ({
            width: components.message.closeIcon.size,
            height: components.message.closeIcon.size,
            color:
              components.message.colorScheme[severityKey[severity]].closeButton
                .color,
          })}
        />
      )}
    </Pressable>
  )
}
