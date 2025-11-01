import type { Meta, StoryObj } from '@storybook/react'

import { ProgressSpinner } from './ProgressSpinner'

const meta: Meta<typeof ProgressSpinner> = {
  title: 'ProgressSpinner',
  component: ProgressSpinner,
  args: { size: 'md', fill: 'primary' },
  argTypes: {
    fill: { control: 'radio', options: ['primary', 'white'] },
    size: { control: 'radio', options: ['xl', 'lg', 'md', 'sm'] },
  },
}

export default meta

type Story = StoryObj<typeof ProgressSpinner>

const ProgressSpinnerStory: Story = {}

export { ProgressSpinnerStory as ProgressSpinner }
