import type { Meta, StoryObj } from '@storybook/react'
import {
  IconArrowDownRight,
  IconArrowDownLeft,
} from '@tabler/icons-react-native'

import { ButtonSeverity } from './ButtonSeverity'

const meta: Meta<typeof ButtonSeverity> = {
  title: 'ButtonSeverity',
  component: ButtonSeverity,
  args: {
    size: 'base',
    shape: 'square',
    variant: 'basic',
    label: 'Button',
    loading: false,
    disabled: false,
    iconPosition: 'left',
    severity: 'info',
  },
  argTypes: {
    size: { control: 'radio', options: ['small', 'base', 'large', 'xlarge'] },
    shape: { control: 'radio', options: ['square', 'circle'] },
    variant: { control: 'radio', options: ['basic', 'outlined', 'text'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconPosition: { control: 'radio', options: ['left', 'right'] },
    onPress: { action: 'OnPress' },
    severity: {
      control: 'radio',
      options: ['help', 'info', 'success', 'warning', 'danger'],
    },
  },
}

export default meta

type Story = StoryObj<typeof ButtonSeverity>

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
