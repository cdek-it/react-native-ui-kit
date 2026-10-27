import type { Preview } from '@storybook/react'
import { StyleSheet } from 'react-native-unistyles'
import { View } from 'react-native'
import React from 'react'

const preview: Preview = {
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        includeNames: true,
        order: ['*', 'Typography', ['Overview', '*']],
      },
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  },
}

export default preview

const styles = StyleSheet.create(({ theme }) => ({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.Surface['surface-card'],
  },
}))
