import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import React, { useCallback } from 'react'

import { InputText } from '../InputText'

const meta: Meta<typeof InputText> = {
  title: 'Input/InputText',
  args: {
    clearable: true,
    disabled: false,
    state: 'default',
    placeholder: 'Placeholder',
    value: '',
  },
  argTypes: {
    state: { control: 'radio', options: ['default', 'danger'] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const onChangeText = useCallback(
      (nextValue: string) => updateArgs({ value: nextValue }),
      [updateArgs]
    )

    return <InputText {...args} onChangeText={onChangeText} />
  },
}

export default meta

type Story = StoryObj<typeof InputText>

const InputTextStory: Story = {}

export { InputTextStory as InputText }
