import type { Preview } from '@storybook/react'
import {
  makeStyles,
  ThemeContextProvider,
  ThemeVariant,
  useChangeTheme,
} from '../src'
import { View } from 'react-native'
import { type FunctionComponent, type ReactNode, useEffect } from 'react'

const preview: Preview = {
  decorators: [
    (Story, { args }) => {
      return (
        <ThemeContextProvider initialTheme={args.theme}>
          <Container theme={args.theme}>
            <View style={{ padding: 16, flex: 1 }}>
              <Story />
            </View>
          </Container>
        </ThemeContextProvider>
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
  const styles = useStyles()
  const changeTheme = useChangeTheme()

  useEffect(() => {
    changeTheme(theme)
  }, [theme, changeTheme])

  return <View style={styles.container}>{children}</View>
}

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.theme.Surface['surface-ground'],
  },
}))
