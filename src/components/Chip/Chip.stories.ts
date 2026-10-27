import type { Meta, StoryObj } from '@storybook/react'
import { IconCheck, IconUser } from '@tabler/icons-react-native'

import { Chip } from './Chip'

const icons = { IconCheck, IconUser, none: undefined }

const meta: Meta<typeof Chip> = {
  title: 'Misc/Chip',
  tags: ['migration:excluded'],
  component: Chip,
  args: {
    Icon: IconCheck,
    label: 'Chip',
    disabled: false,
    showIcon: true,
    showClose: false,
  },
  argTypes: {
    Icon: { control: 'radio', options: Object.keys(icons), mapping: icons },
    onPress: { action: 'onPress' },
    onClose: { action: 'close' },
  },
}
export default meta

type Story = StoryObj<typeof Chip>

const ChipStory: Story = {}

export { ChipStory as Chip }
