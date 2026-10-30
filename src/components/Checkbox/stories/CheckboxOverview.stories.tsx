import type { Meta, StoryObj } from '@storybook/react'
import { ScrollView, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Checkbox, type CheckboxProps } from '../Checkbox'

import { CheckboxCardGroupExample } from './CheckboxCardGroupExample'
import { CheckboxGroupExample } from './CheckboxGroupExample'

const meta: Meta<CheckboxProps> = {
  title: 'Form/Checkbox',
  tags: ['version:2.0'],
  component: Checkbox,
  argTypes: {
    onCheckedChange: { action: 'onCheckedChange' },
    onPress: { action: 'onPress' },
  },
  parameters: { controls: { include: ['theme'] } },
  render: ({ onCheckedChange, onPress }) => (
    <ScrollView contentContainerStyle={styles.root}>
      <CheckboxGroupExample
        onCheckedChange={onCheckedChange}
        onPress={onPress}
      />
      <View style={styles.divider} />
      <CheckboxCardGroupExample
        onCheckedChange={onCheckedChange}
        onPress={onPress}
      />
    </ScrollView>
  ),
}

export default meta

type Story = StoryObj<CheckboxProps>

export const Overview: Story = {}

const styles = StyleSheet.create(({ semantic }) => ({
  root: { alignItems: 'flex-start', gap: semantic.dimension.space[400] },
  divider: {
    alignSelf: 'stretch',
    height: semantic.dimension.borderWidth[100],
    backgroundColor: semantic.colorScheme.color.border.neutral.default,
  },
}))
