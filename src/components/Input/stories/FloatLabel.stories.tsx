import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { useCallback } from 'react'

import { FloatLabel } from '../FloatLabel'

const meta: Meta<typeof FloatLabel> = {
  title: 'Input/FloatLabel',
  args: {
    clearable: true,
    secureTextEntry: false,
    disabled: false,
    state: 'default',
    placeholder: 'Placeholder',
    value: '',
    loading: false,
  },
  argTypes: {
    state: { control: 'radio', options: ['default', 'danger'] },
    secureTextEntry: {
      control: 'radio',
      options: ['off', 'on', 'toggleable'],
      mapping: { off: false, on: true, toggleable: 'toggleable' },
    },
  },
  render: (args) => {
    const [, updateArgs] = useArgs()

    const onChangeText = useCallback(
      (nextValue: string) => {
        updateArgs({ value: nextValue })
      },
      [updateArgs]
    )

    return <FloatLabel {...args} onChangeText={onChangeText} />
  },
}

export default meta

type Story = StoryObj<typeof FloatLabel>

const FloatLabelStory: Story = {}
const FloatLabelMultilineStory: Story = {
  args: { multiline: true, value: undefined },
  parameters: { controls: { exclude: ['multiline', 'value'] } },
  render: (args) => <FloatLabel {...args} />,
}

export {
  FloatLabelStory as FloatLabel,
  FloatLabelMultilineStory as FloatLabelMultiline,
}
