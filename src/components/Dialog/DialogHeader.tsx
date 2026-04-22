import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconHelpCircle,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react-native'
import { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { SvgUniversal, type SvgSource } from '../../utils'
import { Title } from '../Typography'

type Severity = 'danger' | 'warning' | 'info' | 'success' | 'help'

export interface DialogHeaderProps {
  readonly title: string
  readonly onClose?: () => void
  readonly severity?: Severity
}

const iconsMap: Record<Severity, SvgSource> = {
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

    const source = iconsMap[severity]

    return (
      <SvgUniversal
        {...styles.severityIcon}
        source={source}
        uniProps={({ typography: t }) => ({
          color: {
            danger: t.Color.Service['text-danger'],
            warning: t.Color.Service['text-warning'],
            info: t.Color.Service['text-info'],
            success: t.Color.Service['text-success'],
            help: t.Color.Service['text-help'],
          }[severity],
        })}
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
            <SvgUniversal
              {...styles.closeIcon}
              source={IconX}
              uniProps={({ theme }) => ({
                color: theme.General.actionIconColor,
              })}
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
  },
  severityIcon: {
    width: typography.Size['text-2xl'],
    height: typography.Size['text-2xl'],
  },
}))

export const DialogHeaderTestId = {
  title: 'DialogTitle',
  closeButton: 'DialogCloseButton',
}
