import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import { MenuItemTemplate } from './MenuItemTemplate'

const meta: Meta<typeof MenuItemTemplate> = {
  title: 'MenuItemTemplate',
  component: MenuItemTemplate,
  args: {
    prefix: 'none',
    title: 'Menu Item',
    caption: 'Caption',
    suffix: 'none',
  },
  argTypes: {
    prefix: { control: 'radio', options: ['none', 'right', 'down'] },
    title: { control: 'text' },
    suffix: { control: 'radio', options: ['none', 'right', 'down'] },
  },
  decorators: [
    (Story) => (
      <View
        style={{
          padding: 16,
          alignContent: 'center',
          alignItems: 'center',
          backgroundColor: 'orange',
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
