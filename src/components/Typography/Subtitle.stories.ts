import type { Meta, StoryObj } from '@storybook/react'

import { Subtitle } from './Subtitle'

const meta: Meta<typeof Subtitle> = {
  title: 'Typography/Subtitle',
  component: Subtitle,
  args: {
    base: false,
    color: 'default',
    children: 'Subtitle',
  },
  argTypes: {
    color: { control: 'radio', options: ['default', 'primary', 'secondary'] },
  },
}

export default meta

type Story = StoryObj<typeof Subtitle>

const SubtitleStory: Story = {}

export { SubtitleStory as Subtitle }
