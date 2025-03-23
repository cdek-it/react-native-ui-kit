import type { Meta, StoryObj } from '@storybook/react'

import { Service } from './Service'

const meta: Meta<typeof Service> = {
  title: 'Typography/Service',
  component: Service,
  args: { variant: 'success', children: 'Test', base: true, showIcon: true },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['success', 'danger', 'info', 'help', 'warning'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Service>

const ServiceStory: Story = {}

export { ServiceStory as Service }
