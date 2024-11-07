import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Title } from './Title'

const meta: Meta<typeof Title> = {
  title: 'Title',
  component: Title,
  args: {
    level: 'h1',
    children: 'Test',
  },
  argTypes: {
    level: { control: 'radio', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
  },
  decorators: [(Story) => <Story />],
}

export default meta

type Story = StoryObj<typeof Title>

export const Typography: Story = {
  args: {},
  argTypes: {},
}
