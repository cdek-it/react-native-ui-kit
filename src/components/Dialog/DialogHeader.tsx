import {
  type Icon,
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconHelpCircle,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react-native'
import { TouchableOpacity, View } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'
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
  const styles = useStyles()
  const tids = DialogHeaderTestId
  const Icon = severity ? iconsMap[severity] : undefined

  return (
    <>
      <View style={styles.header}>
        {Icon && severity ? (
          <Icon {...styles.severityIcon} {...styles[severity]} />
        ) : null}
        <Title level='h3' style={styles.text} testID={tids.title}>
          {title}
        </Title>
        {onClose ? (
          <TouchableOpacity
            style={styles.closeTouchable}
            testID={tids.closeButton}
            onPress={onClose}
          >
            <IconX {...styles.closeIcon} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.separator} />
    </>
  )
}

const useStyles = makeStyles(({ theme, spacing, typography }) => ({
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
    height: 1,
    backgroundColor: theme.Overlay.Overlay.overlayContentBorderColor,
  },
  closeIcon: { width: 14, height: 14, color: theme.General.actionIconColor },
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
