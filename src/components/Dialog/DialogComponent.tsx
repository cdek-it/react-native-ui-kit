import React, { type ReactNode } from 'react'
import { View, useWindowDimensions } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

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

const styles = StyleSheet.create(({ components }) => ({
  root: {
    backgroundColor: components.dialog.root.background,
    borderColor: components.dialog.root.borderColor,
    borderRadius: components.dialog.root.borderRadius,
  },
  body: { padding: components.dialog.content.padding },
  footer: {
    paddingTop: components.dialog.footer.paddingTop,
    paddingBottom: components.dialog.footer.paddingBottom,
    paddingHorizontal: components.dialog.footer.paddingLeft,
  },
}))
