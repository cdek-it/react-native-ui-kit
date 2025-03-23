import type { Meta, StoryObj } from '@storybook/react'

import { Caption } from './Caption'

const meta: Meta<typeof Caption> = {
  title: 'Typography/Caption',
  component: Caption,
  args: { color: 'default', children: 'Test' },
  argTypes: {
    color: { control: 'radio', options: ['default', 'secondary', 'primary'] },
  },
}

export default meta

type Story = StoryObj<typeof Caption>

const CaptionStory: Story = {}

export { CaptionStory as Caption }
