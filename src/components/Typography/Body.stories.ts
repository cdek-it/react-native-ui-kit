import type { Meta, StoryObj } from '@storybook/react'

import { Body } from './Body'

const meta: Meta<typeof Body> = {
  title: 'Body',
  component: Body,
  args: {
    color: 'default',
    children: 'Test',
    disabled: false,
    paragraph: false,
    weight: 'regular',
    base: false,
  },
  argTypes: {
    color: { control: 'radio', options: ['default', 'secondary', 'primary'] },
    disabled: { control: 'boolean' },
    paragraph: { control: 'boolean' },
    weight: { control: 'radio', options: ['regular', 'medium', 'bold'] },
    base: { control: 'boolean' },
  },
}

export default meta

type Story = StoryObj<typeof Body>

export const Typography: Story = {
  args: {},
  argTypes: {},
}
