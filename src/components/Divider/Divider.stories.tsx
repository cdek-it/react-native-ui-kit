import type { Meta, StoryObj } from '@storybook/react'
import { IconCircleCheck, IconInfoCircle } from '@tabler/icons-react-native'
import React from 'react'
import { View } from 'react-native'

import { Divider } from './Divider'

const icons = {
  IconInfoCircle,
  IconCircleCheck,
  none: undefined,
}

const meta: Meta<typeof Divider> = {
  title: 'Divider',
  component: Divider,
  decorators: (Story) => (
    <View style={{ height: 300 }}>
      <Story />
    </View>
  ),
  args: {
    align: 'center',
    layout: 'horizontal',
    showContent: true,
    showIcon: true,
    text: 'subtitle sm',
    type: 'solid',
    Icon: IconCircleCheck,
  },
  argTypes: {
    align: {
      control: 'radio',
      options: ['start', 'center', 'end'],
    },
    layout: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    type: {
      control: 'radio',
      options: ['solid', 'dash'],
    },
    Icon: {
      control: 'radio',
      options: Object.keys(icons),
      mapping: icons,
    },
  },
}

export default meta

type Story = StoryObj<typeof Divider>

const DividerStory: Story = {}

export { DividerStory as Divider }
