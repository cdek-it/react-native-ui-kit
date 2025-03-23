import type { Meta, StoryObj } from '@storybook/react'
import { IconArrowDownRight, IconUser } from '@tabler/icons-react-native'

import { ToggleButton } from './ToggleButton'

const icons = { IconArrowDownRight, IconUser, none: undefined }

const meta: Meta<typeof ToggleButton> = {
  title: 'ToggleButton',
  component: ToggleButton,
  args: {
    checked: false,
    disabled: false,
    iconOnly: false,
    iconPos: 'left',
    label: 'ButtonToggle',
    size: 'base',
    Icon: IconArrowDownRight,
  },
  argTypes: {
    iconPos: {
      control: 'radio',
      options: ['left', 'right', 'null'],
      mapping: { null: null },
    },
    size: { control: 'radio', options: ['xlarge', 'large', 'base', 'small'] },
    Icon: { control: 'radio', options: Object.keys(icons), mapping: icons },
    onPress: { action: 'onPress' },
  },
}

export default meta

type Story = StoryObj<typeof ToggleButton>

const ToggleButtonStory: Story = {}

export { ToggleButtonStory as ToggleButton }
