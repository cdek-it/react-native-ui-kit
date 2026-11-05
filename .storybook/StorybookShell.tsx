import type { ReactNode } from 'react'
import { Appearance, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { ThemeContextProvider, ThemeVariant } from '../src/theme'

import { StorybookToolbar } from './StorybookToolbar'

const initialTheme =
  Appearance.getColorScheme() === 'dark'
    ? ThemeVariant.Dark
    : ThemeVariant.Light

export const StorybookShell = ({ children }: { children: ReactNode }) => (
  <ThemeContextProvider initialTheme={initialTheme}>
    <View style={styles.container}>
      <StorybookToolbar />
      {children}
    </View>
  </ThemeContextProvider>
)

const styles = StyleSheet.create(({ semantic }, rt) => ({
  container: {
    flex: 1,
    paddingTop: rt.insets.top,
    backgroundColor: semantic.colorScheme.color.bg.surface.default.default,
  },
}))
