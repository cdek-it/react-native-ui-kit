import { IconMoon, IconSun } from '@tabler/icons-react-native'
import React, { useState } from 'react'
import { Appearance, Pressable, Text, View } from 'react-native'
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles'

import { ThemeVariant } from '../src/theme'

const THEME_TOGGLE_LABELS = {
  light: 'Включить тёмную тему',
  dark: 'Включить светлую тему',
}

export const StorybookToolbar = ({
  initialTheme,
}: {
  initialTheme: ThemeVariant
}) => {
  const [isDark, setIsDark] = useState(initialTheme === ThemeVariant.Dark)
  const theme = UnistylesRuntime.getTheme(isDark ? 'dark' : 'light')
  const ThemeIcon = isDark ? IconSun : IconMoon

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark'
    Appearance.setColorScheme(nextTheme)
    UnistylesRuntime.setTheme(nextTheme)
    setIsDark(!isDark)
  }

  return (
    <View style={styles.toolbar}>
      <Text style={styles.title}>Storybook</Text>
      <Pressable
        accessibilityRole='button'
        accessibilityLabel={THEME_TOGGLE_LABELS[isDark ? 'dark' : 'light']}
        onPress={toggleTheme}
        style={styles.themeButton}
        testID='StorybookThemeToggle'
      >
        <ThemeIcon
          accessible={false}
          size={20}
          color={theme.semantic.colorScheme.color.fg.default}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create(({ semantic }) => ({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: semantic.colorScheme.color.border.neutral.default,
  },
  title: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '600',
    color: semantic.colorScheme.color.fg.default,
  },
  themeButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
}))
