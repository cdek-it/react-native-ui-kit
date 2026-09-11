import type { Meta, StoryObj } from '@storybook/react'

import { Body } from './Body'

const meta: Meta<typeof Body> = {
  title: 'Typography/Body',
  component: Body,
  args: {
    color: 'default',
    children: 'Test',
    disabled: false,
    paragraph: false,
    size: 'lg',
    strikethrough: false,
    weight: 'regular',
  },
  argTypes: {
    color: { control: 'radio', options: ['default', 'secondary', 'primary'] },
    disabled: { control: 'boolean' },
    paragraph: { control: 'boolean' },
    size: { control: 'radio', options: ['base', 'lg', 'xl'] },
    strikethrough: { control: 'boolean' },
    weight: { control: 'radio', options: ['regular', 'bold'] },
  },
}

export default meta

type Story = StoryObj<typeof Body>

const BodyStory: Story = {}

export { BodyStory as Body }
