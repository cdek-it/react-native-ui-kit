import type { Meta, StoryObj } from '@storybook/react'

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
