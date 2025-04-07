import type { Meta, StoryObj } from '@storybook/react'
import {
  IconCheck,
  IconDiamond,
  IconList,
  IconUser,
} from '@tabler/icons-react-native'

import { View } from 'react-native'

import { ListBase } from './ListBase'

const Icons = { undefined, IconList, IconUser, IconCheck }
const Extras = {
  undefined,
  IconDiamond: <IconDiamond height={21} width={21} />,
}

const meta: Meta<typeof ListBase> = {
  title: 'List',
  component: ListBase,
  args: {
    iconAlignment: 'top',
    text: 'Title',
    title: 'Subtitle',
    caption: 'Caption',
    LeftIcon: IconList,
    RightIcon: IconCheck,
    extra: <IconUser />,
    divider: undefined,
    disabled: false,
  },
  argTypes: {
    iconAlignment: { control: 'radio', options: ['top', 'center'] },
    LeftIcon: {
      control: 'select',
      options: Object.keys(Icons),
      mapping: Icons,
    },
    text: { control: 'text' },
    title: { control: 'text' },
    caption: { control: 'text' },
    RightIcon: {
      control: 'select',
      options: Object.keys(Icons),
      mapping: Icons,
    },
    extra: { control: 'select', options: Object.keys(Extras), mapping: Extras },
    divider: { control: 'radio', options: [undefined, 'content', 'full'] },
    disabled: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
  decorators: [
    (Story) => (
      <View
        style={{ padding: 16, alignContent: 'center', alignItems: 'center' }}
      >
        <Story />
      </View>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof ListBase>

export const ListBaseStory: Story = {
  args: { text: 'ListBase' },
  argTypes: {},
  parameters: {
    notes: `
      #### Элемент списка - полный набор свойств

      <ListBase
        iconAlignment: 'top',
        title: 'Title',
        subtitle: 'Subtitle',
        caption: 'Caption',
        LeftIcon: IconList,
        RightIcon: IconCheck,
        extra: <IconUser />,
      />
  `,
  },
}
