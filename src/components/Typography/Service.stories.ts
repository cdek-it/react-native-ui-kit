import type { Meta, StoryObj } from '@storybook/react'

import { IconBuildingSkyscraper } from '@tabler/icons-react-native'

import { Service } from './Service'

const icons = { IconBuildingSkyscraper, none: undefined }

const meta: Meta<typeof Service> = {
  title: 'Typography/Service',
  component: Service,
  args: { variant: 'success', children: 'Test', base: true, showIcon: true },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['success', 'danger', 'info', 'help', 'warning'],
    },
    Icon: { control: 'radio', options: Object.keys(icons), mapping: icons },
  },
}

export default meta

type Story = StoryObj<typeof Service>

const ServiceStory: Story = {}

export { ServiceStory as Service }
