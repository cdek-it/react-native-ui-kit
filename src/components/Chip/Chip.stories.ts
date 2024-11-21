import type { Meta, StoryObj } from '@storybook/react'
import { IconCheck } from '@tabler/icons-react-native'

import { Chip } from './Chip'

const meta: Meta<typeof Chip> = {
  title: 'Chip',
  component: Chip,
  args: {
    showClose: true,
    disabled: false,
  },
  argTypes: {
    showClose: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Chip>

const ChipStory: Story = {
  args: {
    children: 'Chip',
    Icon: IconCheck,
    showClose: true,
    disabled: false,
    onClose: () => {
      console.log('Tap close Chip')
    },
    onPress: () => {
      console.log('Tap Chip')
    },
  },
}

export { ChipStory as Chip }
