import { IconX } from '@tabler/icons-react-native'
import React from 'react'
import { View, TouchableOpacity, useWindowDimensions } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'
import { Title } from '../Typography'

export interface DialogComponentProps {
  readonly title: string
  readonly body?: React.ComponentType
  readonly footer?: React.ComponentType
  readonly onClose?: () => void
}

export const DialogComponent: React.FC<DialogComponentProps> = ({
  title,
  body: Body,
  footer: Footer,
  onClose,
}) => {
  const styles = useStyles()
  const tids = DialogTestIDs
  const { width, height } = useWindowDimensions()
  const maxSize = { maxWidth: width - 40, maxHeight: height - 100 }

  return (
    <View style={[styles.root, maxSize]}>
      <View style={styles.header}>
        <Title level='h3' style={styles.text} testID={tids.title}>
          {title}
        </Title>
        <TouchableOpacity
          style={styles.closeTouchable}
          testID={tids.closeButton}
          onPress={onClose}
        >
          <IconX {...styles.closeIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />

      <View style={styles.body}>{Body ? <Body /> : null}</View>

      <View style={styles.footer}>{Footer ? <Footer /> : null}</View>
    </View>
  )
}

const useStyles = makeStyles(({ theme, spacing }) => ({
  root: {
    backgroundColor: theme.Overlay.Dialog.Header.dialogHeaderBg,
    borderColor: theme.Overlay.Overlay.overlayContentBorderColor,
    borderRadius: theme.General.borderRadius,
  },
  body: {
    paddingVertical: theme.Overlay.Dialog.Body.dialogContentPaddingTopBottom,
    paddingHorizontal: theme.Overlay.Dialog.Body.dialogContentPaddingLeftRight,
  },
  footer: {
    paddingBottom: theme.Overlay.Dialog.Footer.dialogFooterPaddingLeftRight,
    paddingHorizontal: theme.Overlay.Dialog.Footer.dialogFooterPaddingLeftRight,
  },
  text: { flexWrap: 'wrap', flex: 1 },
  header: {
    width: '100%',
    gap: spacing.Gap['gap-4'],
    flexDirection: 'row',
    justifyContent: 'space-between',
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
}))

const DialogTestIDs = { title: 'DialogTitle', closeButton: 'DialogCloseButton' }
