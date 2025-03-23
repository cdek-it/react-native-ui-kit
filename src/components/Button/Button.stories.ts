import type { Meta, StoryObj } from '@storybook/react'
import {
  IconArrowDownRight,
  IconArrowDownLeft,
} from '@tabler/icons-react-native'

import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  args: {
    size: 'base',
    shape: 'square',
    variant: 'basic',
    label: 'Button',
    loading: false,
    disabled: false,
    iconPosition: 'left',
  },
  argTypes: {
    size: { control: 'radio', options: ['small', 'base', 'large', 'xlarge'] },
    shape: { control: 'radio', options: ['square', 'circle'] },
    variant: { control: 'radio', options: ['basic', 'outlined', 'text'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconPosition: { control: 'radio', options: ['left', 'right'] },
    onPress: { action: 'OnPress' },
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const TextButton: Story = { args: {}, argTypes: {} }

const Icons = { IconArrowDownRight, IconArrowDownLeft }

export const IconButton: Story = {
  args: { Icon: IconArrowDownRight },
  argTypes: {
    iconOnly: {
      control: 'radio',
      options: ['IconOnly', 'Not IconOnly'],
      mapping: { IconOnly: true, 'Not IconOnly': undefined },
    },
    Icon: { control: 'select', options: Object.keys(Icons), mapping: Icons },
  },
}
