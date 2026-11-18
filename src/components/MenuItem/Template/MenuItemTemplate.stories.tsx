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
  title: 'Mixins/MenuItemTemplate',
  component: MenuItemTemplate,
  args: {
    title: 'Menu Item',
    Icon: undefined,
    badgeSeverity: undefined,
    caption: 'Caption',
    separator: false,
    disabled: false,
    selected: false,
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
    badgeSeverity: {
      control: 'radio',
      options: ['undefined', 'basic', 'info', 'success', 'warning', 'danger'],
    },
    title: { control: 'text' },
    separator: { control: 'boolean' },
    selected: {
      control: 'boolean',
      description: 'Выбранный пункт меню, управляемый через selected',
    },
    extra: { control: 'select', options: Object.keys(Extras), mapping: Extras },
    onPress: { action: 'pressed' },
  },
  parameters: { controls: { exclude: ['iconColor'] } },
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
  args: { title: 'MenuItemTemplate' },
  argTypes: {},
}
export { MenuItemTemplateStory as MenuItemTemplate }
