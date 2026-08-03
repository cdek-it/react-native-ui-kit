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
        uniProps={({ semantic }) => ({
          color: {
            danger: semantic.colorScheme.color.fg.status.danger.default,
            warning: semantic.colorScheme.color.fg.status.warning.default,
            info: semantic.colorScheme.color.fg.status.info.default,
            success: semantic.colorScheme.color.fg.status.success.default,
            help: semantic.colorScheme.color.fg.status.help.default,
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
              uniProps={({ components }) => ({
                color: components.dialog.root.color,
              })}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.separator} />
    </>
  )
}

const styles = StyleSheet.create(({ semantic, components }) => ({
  text: { flex: 1 },
  header: {
    flexDirection: 'row',
    gap: components.dialog.header.gap,
    alignItems: 'center',
    paddingTop: components.dialog.header.paddingTop,
    paddingBottom: components.dialog.header.paddingBottom,
    paddingHorizontal: components.dialog.header.paddingLeft,
  },
  closeTouchable: { padding: 8 },
  separator: {
    height: semantic.dimension.borderWidth[100],
    backgroundColor: components.dialog.root.borderColor,
  },
  closeIcon: {
    width: semantic.dimension.size[450],
    height: semantic.dimension.size[450],
  },
  severityIcon: {
    width: semantic.dimension.size[700],
    height: semantic.dimension.size[700],
  },
}))

export const DialogHeaderTestId = {
  title: 'DialogTitle',
  closeButton: 'DialogCloseButton',
}
