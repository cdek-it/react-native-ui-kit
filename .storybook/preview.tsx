import type { Preview } from '@storybook/react'
import { StyleSheet } from 'react-native-unistyles'
import { View } from 'react-native'

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

const styles = StyleSheet.create(({ semantic }, rt) => ({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:
      rt.themeName === 'dark'
        ? semantic.colorScheme.color.bg.surface.canvas.default
        : semantic.colorScheme.color.bg.surface.default.default,
  },
}))
