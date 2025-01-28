import type { Meta, StoryObj } from '@storybook/react'
import { IconCheck, IconUser } from '@tabler/icons-react-native'
import React from 'react'

import { Badge } from '../../Badge'

import { TabItem } from './TabItem'

const icons = {
  IconUser,
  IconCheck,
  none: undefined,
}

const badges = {
  basic: <Badge>99</Badge>,
  danger: <Badge severity='danger'>0</Badge>,
  point: <Badge dot />,
  none: undefined,
}

const meta: Meta<typeof TabItem> = {
  title: 'TabItem',
  component: TabItem,
  argTypes: {
    Icon: {
      control: 'radio',
      options: Object.keys(icons),
      mapping: icons,
    },
    badge: {
      control: 'radio',
      options: Object.keys(badges),
      mapping: badges,
    },
  },
}
export default meta

export type Story = StoryObj<typeof TabItem>

export const TabItemStory: Story = {
  args: {
    Icon: IconUser,
    label: 'First Tab',
    badge: <Badge>99</Badge>,
  },
}
