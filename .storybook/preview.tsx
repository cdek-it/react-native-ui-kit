import type { Preview } from '@storybook/react'
import { useArgs } from '@storybook/preview-api'
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles'
import { ThemeContextProvider, ThemeVariant } from '../src/theme'
import { View, Appearance } from 'react-native'
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  type FunctionComponent,
  type ReactNode,
} from 'react'

let currentTheme =
  Appearance.getColorScheme() === 'dark'
    ? ThemeVariant.Dark
    : ThemeVariant.Light

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const [args, updateArgs] = useArgs<StorybookThemeArgs>()

      return (
        <Container theme={args.theme} updateArgs={updateArgs}>
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
  args: { theme: currentTheme },
}

export default preview

interface StorybookThemeArgs {
  theme: ThemeVariant
}

const THEME_NAME_MAP: Record<ThemeVariant, 'light' | 'dark'> = {
  [ThemeVariant.Light]: 'light',
  [ThemeVariant.Dark]: 'dark',
}

const Container: FunctionComponent<{
  children: ReactNode
  theme: ThemeVariant
  updateArgs: (args: StorybookThemeArgs) => void
}> = ({ children, theme, updateArgs }) => {
  const themeSynchronized = useRef(false)

  useEffect(() => {
    if (!themeSynchronized.current) {
      themeSynchronized.current = true
      updateArgs({ theme: currentTheme })
    }
  }, [updateArgs])

  useLayoutEffect(() => {
    if (themeSynchronized.current) {
      const nextTheme = THEME_NAME_MAP[theme]
      Appearance.setColorScheme(nextTheme)
      UnistylesRuntime.setTheme(nextTheme)
      currentTheme = theme
    }
  }, [theme])

  return (
    <ThemeContextProvider initialTheme={currentTheme}>
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
