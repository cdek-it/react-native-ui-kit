import { useArgs } from '@storybook/preview-api'
import type { StoryObj } from '@storybook/react'
import { useCallback, useEffect, useState } from 'react'

import {
  getInputLabelProps,
  inputLabelControls,
  type InputLabelStoryArgs,
  type InputStoryMeta,
} from '../../../../.storybook/inputLabelControls'

import { InputText, type InputTextProps } from './InputText'

type StoryArgs = InputLabelStoryArgs<InputTextProps>

const meta = {
  title: 'Input/InputText',
  tags: ['version:2.0', 'design:pending'],
  component: InputText,
  args: {
    labelMode: 'label',
    labelText: 'Название',
    placeholder: 'Введите текст',
    value: '',
    size: 'base',
    state: 'default',
    clearable: true,
    disabled: false,
    readOnly: false,
    required: false,
    labelInfo: undefined,
    caption: 'Подсказка к полю',
  },
  argTypes: {
    ...inputLabelControls,
    placeholder: { control: 'text' },
    value: { control: 'text' },
    size: { control: 'radio', options: ['small', 'base', 'large', 'xlarge'] },
    state: { control: 'radio', options: ['default', 'danger'] },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    caption: { control: 'text' },
    onChangeText: { action: 'onChangeText' },
  },
  parameters: {
    controls: {
      include: [
        'labelMode',
        'labelText',
        'placeholder',
        'value',
        'size',
        'state',
        'clearable',
        'disabled',
        'readOnly',
        'required',
        'labelInfo',
        'caption',
      ],
    },
  },
  render: (args) => {
    const {
      labelMode,
      labelText,
      labelInfo,
      onChangeText: onChangeTextAction,
      ...props
    } = args
    const labelProps = getInputLabelProps({ labelMode, labelText, labelInfo })
    const [, updateArgs] = useArgs()
    const [value, setValue] = useState(props.value)

    useEffect(() => setValue(props.value), [props.value])

    const onChangeText = useCallback(
      (nextValue: string) => {
        setValue(nextValue)
        updateArgs({ value: nextValue })
        onChangeTextAction?.(nextValue)
      },
      [onChangeTextAction, updateArgs]
    )

    return (
      <InputText
        {...props}
        {...labelProps}
        value={value}
        onChangeText={onChangeText}
      />
    )
  },
} satisfies InputStoryMeta<InputTextProps, StoryArgs>

export default meta

type Story = StoryObj<StoryArgs>

const InputTextStory: Story = { name: 'InputText' }

export { InputTextStory as InputText }
