import type { Meta, StoryObj } from '@storybook/react'
import {
  IconAlertTriangle,
  IconCheck,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
} from '@tabler/icons-react-native'

import { Tag } from './Tag'

const icons = {
  IconCheck,
  IconCircleCheck,
  IconInfoCircle,
  IconAlertTriangle,
  IconCircleX,
  default: undefined,
}

const meta: Meta<typeof Tag> = {
  title: 'Misc/Tag',
  tags: ['design:pending'],
  component: Tag,
  args: { text: 'Tag', rounded: false, severity: 'primary', showIcon: true },
  argTypes: {
    text: { control: 'text' },
    rounded: { control: 'boolean' },
    showIcon: { control: 'boolean' },
    severity: {
      control: 'radio',
      options: ['primary', 'info', 'success', 'warning', 'danger', 'secondary'],
    },
    Icon: { control: 'radio', options: Object.keys(icons), mapping: icons },
  },
}

export default meta

type Story = StoryObj<typeof Tag>

const TagStory: Story = {}

export { TagStory as Tag }
