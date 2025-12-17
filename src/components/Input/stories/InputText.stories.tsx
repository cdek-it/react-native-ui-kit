import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { useCallback, useEffect, useState } from 'react'

import { InputText } from '../InputText'
import type { InputTextBase } from '../InputTextBase/InputTextBase'

const meta: Meta<typeof InputText & typeof InputTextBase> = {
  title: 'Form/InputText',
  args: {
    clearable: true,
    disabled: false,
    state: 'default',
    placeholder: 'Placeholder',
    value: '',
    floatLabel: false,
    secureTextEntry: false,
    loading: false,
    editable: true,
    size: 'base',
  },
  argTypes: {
    state: { control: 'radio', options: ['default', 'danger'] },
    secureTextEntry: {
      control: 'radio',
      options: ['true', 'false', 'toggleable'],
      mapping: { true: true, false: false, toggleable: 'toggleable' },
    },
    size: { control: 'radio', options: ['base', 'large', 'xlarge'] },
  },
  render: (args) => {
    const [, updateArgs] = useArgs()
    const [value, setValue] = useState(args.value)

    const onChangeText = useCallback(
      (nextValue: string) => {
        setValue(nextValue)
        updateArgs({ value: nextValue })
      },
      [updateArgs]
    )

    useEffect(() => {
      setValue(args.value)
    }, [args.value])

    return <InputText {...args} value={value} onChangeText={onChangeText} />
  },
}

export default meta

type Story = StoryObj<typeof InputText>

const InputTextStory: Story = {}

export { InputTextStory as InputText }
