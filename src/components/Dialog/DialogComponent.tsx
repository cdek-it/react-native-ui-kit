import React, { type ReactNode } from 'react'
import { View, useWindowDimensions } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { parseEdgeInsets } from './parseEdgeInsets'

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
  const { width, height } = useWindowDimensions()
  const maxSize = { maxWidth: width - 40, maxHeight: height - 100 }

  return (
    <View style={[styles.root, maxSize]}>
      {header}

      {Body ? (
        <View style={styles.body}>
          <Body />
        </View>
      ) : null}

      {Footer ? (
        <View style={styles.footer}>
          <Footer />
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create(({ theme }) => {
  const footerPadding = parseEdgeInsets(theme.Dialog.footer.padding)

  return {
    root: {
      backgroundColor: theme.Dialog.background,
      borderColor: theme.Dialog.borderColor,
      borderRadius: theme.Dialog.borderRadius,
    },
    body: { padding: theme.Dialog.content.padding },
    footer: {
      paddingTop: footerPadding.top,
      paddingBottom: footerPadding.bottom,
      paddingHorizontal: footerPadding.left,
    },
  }
})
