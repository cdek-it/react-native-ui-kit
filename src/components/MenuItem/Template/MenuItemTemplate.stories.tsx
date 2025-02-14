import type { Meta, StoryObj } from '@storybook/react'
import { IconDiamond, IconList, IconSquare, IconUser } from '@tabler/icons-react-native'
import React from 'react'
import { View } from 'react-native'

import { MenuItemTemplate } from './MenuItemTemplate'

const Icons = { undefined, IconUser, IconList, IconSquare }
const Extras = { undefined, IconDiamond: <IconDiamond height={21} width={21} /> }

const meta: Meta<typeof MenuItemTemplate> = {
  title: 'MenuItemTemplate',
  component: MenuItemTemplate,
  args: {
    prefix: 'none',
    title: 'Menu Item',
    Icon: undefined,
    iconColor: 'rgba(0, 0, 0, 0.8000)',
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
    iconColor: { control: { type: 'color' } },
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
    contentPaddingTop: { control: 'number' },
    contentPaddingBottom: { control: 'number' },
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
  parameters: {
    notes: `
      #### Элемент меню - полный набор свойств
  
      <MenuItemTemplate 
        title="Menu item title"
        caption="Menu item subtitle",
        Icon=IconUser,
        iconColor="#ff0000",
        badgeSeverity="warning",
        prefix="down",
        suffix="right",
        extra=IconDiamond,
        separator=false,
        state="default",
        contentPaddingTop: 0,
        contentPaddingBottom: 0,
        onPress = { Console.log("Menu item pressed) }
      />
  `,
  },
}
