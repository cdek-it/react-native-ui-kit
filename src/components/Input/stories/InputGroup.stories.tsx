import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { IconLock, IconUser } from '@tabler/icons-react-native'
import { useCallback } from 'react'

import { InputGroup } from '../InputGroup'

const meta: Meta<typeof InputGroup> = {
  title: 'Form/InputGroup',
  args: {
    clearable: true,
    disabled: false,
    state: 'default',
    floatLabel: false,
    placeholder: 'Placeholder',
    value: '',
    size: 'base',
  },
  argTypes: {
    state: { control: 'radio', options: ['default', 'danger'] },
    size: { control: 'radio', options: ['base', 'large', 'xlarge'] },
  },
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

const InputGroupStory: Story = {
  args: { left: 'left text', right: 'right text' },
  argTypes: {
    left: {
      options: ['text', 'IconUser', 'IconLock'],
      control: { type: 'radio' },
      mapping: { text: 'left text', IconUser, IconLock },
      defaultValue: 'text',
    },
    right: {
      options: ['text', 'IconUser', 'IconLock'],
      control: { type: 'radio' },
      mapping: { text: 'right text', IconUser, IconLock },
    },
  },
}

export { InputGroupStory as InputGroup }
