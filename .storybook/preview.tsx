import type { Preview } from '@storybook/react'
import { StyleSheet, ThemeContextProvider, ThemeVariant } from '../src'
import { View } from 'react-native'
import React, { type FunctionComponent, type ReactNode } from 'react'

const preview: Preview = {
  decorators: [
    (Story, { args }) => {
      return (
        <Container theme={args.theme}>
          <View style={{ padding: 16, flex: 1 }}>
            <Story />
          </View>
        </Container>
      )
    },
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  },
  argTypes: {
    theme: {
      options: [ThemeVariant.Light, ThemeVariant.Dark],
      control: { type: 'radio' },
    },
  },
  args: { theme: ThemeVariant.Light },
}

export default preview

const Container: FunctionComponent<{
  children: ReactNode
  theme: ThemeVariant
}> = ({ children, theme }) => {
  return (
    <ThemeContextProvider initialTheme={theme}>
      <View style={styles.container}>{children}</View>
    </ThemeContextProvider>
  )
}

const styles = StyleSheet.create(({ theme }) => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.Surface['surface-card'],
  },
}))
