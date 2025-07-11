import React, { type ReactNode } from 'react'
import { View, useWindowDimensions } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

export interface DialogComponentProps {
  readonly body?: React.ComponentType
  readonly footer?: React.ComponentType
  readonly header?: ReactNode
}

export const DialogComponent: React.FC<DialogComponentProps> = ({
  body: Body,
  footer: Footer,
  header = null,
}) => {
  const styles = useStyles()
  const { width, height } = useWindowDimensions()
  const maxSize = { maxWidth: width - 40, maxHeight: height - 100 }

  return (
    <View style={[styles.root, maxSize]}>
      {header}
      <View style={styles.body}>{Body ? <Body /> : null}</View>

      <View style={styles.footer}>{Footer ? <Footer /> : null}</View>
    </View>
  )
}

const useStyles = makeStyles(({ theme }) => ({
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
}))
