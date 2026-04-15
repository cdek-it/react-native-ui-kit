import {
  type Icon,
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconHelpCircle,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react-native'
import { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { StyleSheet } from '../../utils'
import { Title } from '../Typography'

type Severity = 'danger' | 'warning' | 'info' | 'success' | 'help'

export interface DialogHeaderProps {
  readonly title: string
  readonly onClose?: () => void
  readonly severity?: Severity
}

const iconsMap: Record<Severity, Icon> = {
  danger: IconCircleX,
  warning: IconAlertTriangle,
  info: IconInfoCircle,
  success: IconCircleCheck,
  help: IconHelpCircle,
}

export const DialogHeader = ({
  title,
  onClose,
  severity,
}: DialogHeaderProps) => {
  const tids = DialogHeaderTestId

  const icon = useMemo(() => {
    if (!severity) return null

    const Icon = iconsMap[severity]

    return (
      <Icon
        color={styles[severity].color}
        height={styles.severityIcon.height}
        width={styles.severityIcon.width}
      />
    )
  }, [severity])

  return (
    <>
      <View style={styles.header}>
        {icon}
        <Title level='h3' style={styles.text} testID={tids.title}>
          {title}
        </Title>
        {onClose ? (
          <TouchableOpacity
            style={styles.closeTouchable}
            testID={tids.closeButton}
            onPress={onClose}
          >
            <IconX
              color={styles.closeIcon.color}
              height={styles.closeIcon.height}
              width={styles.closeIcon.width}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.separator} />
    </>
  )
}

const styles = StyleSheet.create(({ theme, spacing, typography, border }) => ({
  text: { flex: 1 },
  header: {
    flexDirection: 'row',
    gap: spacing.Gap['gap-4'],
    alignItems: 'center',
    paddingBottom: theme.Overlay.Dialog.Header.dialogHeaderPaddingTopBottom,
    padding: theme.Overlay.Dialog.Header.dialogHeaderPaddingLeftRight,
  },
  closeTouchable: { padding: 8 },
  separator: {
    height: border.Width.border,
    backgroundColor: theme.Overlay.Overlay.overlayContentBorderColor,
  },
  closeIcon: {
    width: typography.Size['text-base'],
    height: typography.Size['text-base'],
    color: theme.General.actionIconColor,
  },
  severityIcon: {
    width: typography.Size['text-2xl'],
    height: typography.Size['text-2xl'],
  },
  danger: { color: typography.Color.Service['text-danger'] },
  warning: { color: typography.Color.Service['text-warning'] },
  info: { color: typography.Color.Service['text-info'] },
  success: { color: typography.Color.Service['text-success'] },
  help: { color: typography.Color.Service['text-help'] },
}))

export const DialogHeaderTestId = {
  title: 'DialogTitle',
  closeButton: 'DialogCloseButton',
}
