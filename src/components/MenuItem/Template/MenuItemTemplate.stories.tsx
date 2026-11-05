import type { Meta, StoryObj } from '@storybook/react'
import {
  IconCheck,
  IconDiamond,
  IconList,
  IconSquare,
  IconUser,
} from '@tabler/icons-react-native'

import { View } from 'react-native'

import { MenuItemTemplate } from './MenuItemTemplate'

const Icons = { None: undefined, IconUser, IconList, IconSquare, IconCheck }
const Extras = {
  undefined,
  IconDiamond: <IconDiamond height={21} width={21} />,
}

const meta: Meta<typeof MenuItemTemplate> = {
  title: 'Menu/MenuItemTemplate',
  tags: ['deprecated'],
  component: MenuItemTemplate,
  args: {
    title: 'Menu Item',
    Icon: undefined,
    iconColor: 'rgba(0, 0, 0, 0.8000)',
    badgeSeverity: undefined,
    caption: 'Caption',
    separator: false,
    disabled: false,
    extra: undefined,
  },
  argTypes: {
    PrefixIcon: {
      control: 'select',
      options: Object.keys(Icons),
      mapping: Icons,
    },
    SuffixIcon: {
      control: 'select',
      options: Object.keys(Icons),
      mapping: Icons,
    },
    Icon: { control: 'select', options: Object.keys(Icons), mapping: Icons },
    iconColor: { control: { type: 'color' } },
    badgeSeverity: {
      control: 'radio',
      options: ['undefined', 'basic', 'info', 'success', 'warning', 'danger'],
    },
    title: { control: 'text' },
    separator: { control: 'boolean' },
    extra: { control: 'select', options: Object.keys(Extras), mapping: Extras },
    onPress: { action: 'pressed' },
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof MenuItemTemplate>

const MenuItemTemplateStory: Story = {
  args: { title: 'Menu item template' },
  argTypes: {},
  parameters: {
    notes: `
      #### Элемент меню - полный набор свойств

      <MenuItemTemplate
        title="Menu item title"
        caption="Menu item subtitle"
        Icon={IconUser}
        iconColor="#ff0000"
        badgeSeverity="warning"
        prefix="down"
        suffix="right"
        extra={IconDiamond}
        separator={false}
        disabled={false}
        onPress={() => console.log("Menu item pressed)}
      />
  `,
  },
}
export { MenuItemTemplateStory as MenuItemTemplate }
