import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Badge',
  component: Badge,
  args: {
    severity: 'basic',
  },
  argTypes: {
    severity: { control: 'radio', options: ['basic', 'info', 'success', 'warning', 'danger'] },
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

type Story = StoryObj<typeof Badge>

export const BadgeDot: Story = {
  args: {
    dot: true,
  },
  argTypes: {},
}

export const BadgeNormal: Story = {
  args: {
    children: 'Test',
  },
  argTypes: {},
}
