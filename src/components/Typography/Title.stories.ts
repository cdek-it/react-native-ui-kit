import type { Meta, StoryObj } from '@storybook/react'

import { Title } from './Title'

const meta: Meta<typeof Title> = {
  title: 'Typography/Title',
  component: Title,
  args: {
    level: 'h1',
    children: 'Test',
  },
  argTypes: {
    level: { control: 'radio', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
  },
}

export default meta

type Story = StoryObj<typeof Title>

const TitleStory: Story = {}

export { TitleStory as Title }
