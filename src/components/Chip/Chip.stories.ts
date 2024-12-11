import type { Meta, StoryObj } from '@storybook/react'
import { IconCheck, IconUser } from '@tabler/icons-react-native'

import { Chip } from './Chip'

const icons = {
  IconCheck,
  IconUser,
  none: undefined,
}

const meta: Meta<typeof Chip> = {
  title: 'Chip',
  component: Chip,
  args: {
    Icon: IconCheck,
    label: 'Chip',
    removable: true,
    disabled: false,
  },
  argTypes: {
    Icon: {
      control: 'radio',
      options: Object.keys(icons),
      mapping: icons,
    },
    onRemove: { action: 'onRemove' },
    onPress: { action: 'onPress' },
  },
}
export default meta

type Story = StoryObj<typeof Chip>

const ChipStory: Story = {}

export { ChipStory as Chip }
