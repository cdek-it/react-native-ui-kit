import type { Meta, StoryObj } from '@storybook/react'
import {
  IconAlertTriangle,
  IconCheck,
  IconCircleX,
  IconInfoCircle,
} from '@tabler/icons-react-native'

import { Tag } from './Tag'

const icons = {
  IconCheck,
  IconInfoCircle,
  IconAlertTriangle,
  IconCircleX,
  none: undefined,
}

const meta: Meta<typeof Tag> = {
  title: 'Tag',
  component: Tag,
  args: {
    text: 'Tag',
    rounded: false,
    severity: 'basic',
    showIcon: true,
    Icon: IconCheck,
  },
  argTypes: {
    severity: {
      control: 'radio',
      options: ['basic', 'info', 'success', 'warning', 'danger', 'secondary'],
    },
    Icon: { control: 'radio', options: Object.keys(icons), mapping: icons },
  },
}

export default meta

type Story = StoryObj<typeof Tag>

const TagStory: Story = {}

export { TagStory as Tag }
