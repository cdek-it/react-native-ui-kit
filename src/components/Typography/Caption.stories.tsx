import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import { Caption } from './Caption'

const meta: Meta<typeof Caption> = {
  title: 'Caption',
  component: Caption,
  args: {
    color: 'default',
    children: 'Test',
  },
  argTypes: {
    color: { control: 'radio', options: ['default', 'secondary', 'primary'] },
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Caption>

export const Typography: Story = {
  args: {},
  argTypes: {},
}
