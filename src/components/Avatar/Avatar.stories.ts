import type { Meta, StoryObj } from '@storybook/react'
import { IconActivity, IconUser } from '@tabler/icons-react-native'

import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Avatar',
  component: Avatar,
  args: {
    size: 'xlarge',
    shape: 'circle',
  },
  argTypes: {
    size: { control: 'radio', options: ['xlarge', 'large', 'normal'] },
    shape: { control: 'radio', options: ['circle', 'square'] },
  },
}

export default meta

type Story = StoryObj<typeof Avatar>

export const LabelAvatar: Story = {
  args: {
    type: 'label',
    children: '1',
  },
  argTypes: {},
}

const Icons = { IconUser, IconActivity }

export const IconAvatar: Story = {
  args: {
    type: 'icon',
    Icon: Icons.IconUser,
  },
  argTypes: {
    Icon: {
      control: 'select',
      options: Object.keys(Icons),
      mapping: Icons,
    },
  },
}
