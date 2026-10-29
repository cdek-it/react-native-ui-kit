import type { Meta, StoryObj } from '@storybook/react'
import { ScrollView, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { RadioButton, type RadioButtonProps } from '../RadioButton'

import { RadioButtonGroupExample } from './RadioButtonGroupExample'
import { RadioCardGroupExample } from './RadioCardGroupExample'

const meta: Meta<RadioButtonProps> = {
  title: 'Form/RadioButton',
  tags: ['version:2.0'],
  component: RadioButton,
  argTypes: { onPress: { action: 'onPress' } },
  parameters: { controls: { include: ['theme'] } },
  render: ({ onPress }) => (
    <ScrollView contentContainerStyle={styles.root}>
      <RadioButtonGroupExample onPress={onPress} />
      <View style={styles.divider} />
      <RadioCardGroupExample onPress={onPress} />
    </ScrollView>
  ),
}

export default meta

type Story = StoryObj<RadioButtonProps>

export const Overview: Story = {}

const styles = StyleSheet.create(({ semantic }) => ({
  root: { alignItems: 'flex-start', gap: semantic.dimension.space[400] },
  divider: {
    alignSelf: 'stretch',
    height: semantic.dimension.borderWidth[100],
    backgroundColor: semantic.colorScheme.color.border.neutral.default,
  },
}))
