import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { IconLock, IconUser } from '@tabler/icons-react-native'
import { useCallback } from 'react'

import { InputGroup } from '../InputGroup'

const meta: Meta<typeof InputGroup> = {
  title: 'Input/InputGroup',
  args: {
    clearable: true,
    disabled: false,
    state: 'default',
    placeholder: 'Placeholder',
    value: '',
  },
  argTypes: { state: { control: 'radio', options: ['default', 'danger'] } },
  render: (args) => {
    const [, updateArgs] = useArgs()

    const onChangeText = useCallback(
      (nextValue: string) => updateArgs({ value: nextValue }),
      [updateArgs]
    )

    return <InputGroup {...args} onChangeText={onChangeText} />
  },
}

export default meta

type Story = StoryObj<typeof InputGroup>

export const InputGroupText: Story = {
  args: { left: 'left text', right: 'right text' },
}

export const InputGroupIcon: Story = {
  args: { left: IconUser, right: IconLock },
  argTypes: {
    left: {
      options: ['IconUser', 'IconLock'],
      control: { type: 'radio' },
      mapping: { IconUser, IconLock },
    },
    right: {
      options: ['IconUser', 'IconLock'],
      control: { type: 'radio' },
      mapping: { IconUser, IconLock },
    },
  },
}
