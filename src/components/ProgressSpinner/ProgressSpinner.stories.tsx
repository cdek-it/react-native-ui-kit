import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { ProgressSpinner } from './ProgressSpinner'

const sizes = ['small', 'base', 'large', 'xlarge'] as const

const meta: Meta<typeof ProgressSpinner> = {
  title: 'Misc/ProgressSpinner',
  tags: ['version:2.0', 'design:pending'],
  component: ProgressSpinner,
  args: { size: 'base', fill: 'primary', accessibilityLabel: 'Загрузка' },
  argTypes: {
    fill: { control: 'radio', options: ['primary', 'white'] },
    size: { control: 'radio', options: sizes },
    accessibilityLabel: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<typeof ProgressSpinner>

const ProgressSpinnerStory: Story = {
  render: (args) => (
    <View
      style={[styles.preview, args.fill === 'white' ? styles.contrast : null]}
    >
      <ProgressSpinner {...args} />
    </View>
  ),
}

export { ProgressSpinnerStory as ProgressSpinner }

const styles = StyleSheet.create(({ semantic }) => ({
  preview: { minHeight: 88, alignItems: 'center', justifyContent: 'center' },
  contrast: {
    backgroundColor: semantic.colorScheme.color.bg.neutral.medium.default,
  },
}))
