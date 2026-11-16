import type { Meta, StoryObj } from '@storybook/react'

import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Misc/Badge',
  component: Badge,
  args: { severity: 'basic', dot: false, children: 'Test', size: 'small' },
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
    severity: {
      control: 'radio',
      options: ['basic', 'info', 'success', 'warning', 'danger'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Badge>

const BadgeStory: Story = { args: { children: 'Test' }, argTypes: {} }

export { BadgeStory as Badge }
