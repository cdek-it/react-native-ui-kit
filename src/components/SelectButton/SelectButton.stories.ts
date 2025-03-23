import type { Meta, StoryObj } from '@storybook/react'
import { IconArrowDownRight } from '@tabler/icons-react-native'

import { SelectButton } from './SelectButton'

const meta: Meta<typeof SelectButton> = {
  title: 'SelectButton',
  component: SelectButton,
  args: {
    buttons: [
      { label: 'But', Icon: IconArrowDownRight, key: '1' },
      { label: 'ButtonSelect', Icon: IconArrowDownRight, key: '2' },
      { label: 'Button', Icon: IconArrowDownRight, key: '3' },
    ],
    size: 'base',
    initialIndex: 1,
    disabled: false,
  },
  argTypes: {
    size: { control: 'radio', options: ['small', 'base', 'large', 'xlarge'] },
    onPress: { action: 'onPress' },
  },
}

export default meta

type Story = StoryObj<typeof SelectButton>

const SelectButtonStory: Story = {}

export { SelectButtonStory as SelectButton }
