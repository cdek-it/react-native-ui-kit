import type { Meta, StoryObj } from '@storybook/react'
import { IconCircle, IconDiamond, IconList, IconSquare, IconUser } from '@tabler/icons-react-native'
import React from 'react'
import { View } from 'react-native'

import { MenuItemTemplate } from './MenuItemTemplate'

const Icons = { undefined, IconUser, IconList, IconSquare }
const Extras = { undefined, IconDiamond, IconCircle }

const meta: Meta<typeof MenuItemTemplate> = {
  title: 'MenuItemTemplate',
  component: MenuItemTemplate,
  args: {
    prefix: 'none',
    title: 'Menu Item',
    Icon: undefined,
    badgeSeverity: undefined,
    caption: 'Caption',
    suffix: 'none',
    separator: false,
    state: 'default',
    extra: undefined,
  },
  argTypes: {
    prefix: { control: 'radio', options: ['none', 'right', 'down'] },
    Icon: {
      control: 'select',
      options: Object.keys(Icons),
      mapping: Icons,
    },
    badgeSeverity: {
      control: 'radio',
      options: ['undefined', 'basic', 'info', 'success', 'warning', 'danger'],
    },
    title: { control: 'text' },
    suffix: { control: 'radio', options: ['none', 'right', 'down'] },
    separator: { control: 'boolean' },
    state: { control: 'radio', options: ['default', 'disabled'] },
    extra: {
      control: 'select',
      options: Object.keys(Extras),
      mapping: Extras,
    },
    onPress: { action: 'pressed' },
  },
  decorators: [
    (Story) => (
      <View
        style={{
          padding: 16,
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        <Story />
      </View>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof MenuItemTemplate>

export const MenuItemTemplateNormal: Story = {
  args: {
    title: 'Menu item template',
  },
  argTypes: {},
}
