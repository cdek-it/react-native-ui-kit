import { useArgs } from '@storybook/preview-api'
import type { StoryObj } from '@storybook/react'
import { useCallback, useEffect, useState } from 'react'

import { inputDocumentationNotes } from '../../../../.storybook/inputDocumentation'
import {
  getInputLabelProps,
  inputLabelControls,
  type InputLabelStoryArgs,
  type InputStoryMeta,
} from '../../../../.storybook/inputLabelControls'
import {
  InputCaption,
  type InputCaptionProps,
} from '../InputCaption/InputCaption'

import { Password } from './Password'
import type { PasswordProps } from './types'

type StoryArgs = InputLabelStoryArgs<PasswordProps> & {
  captionVariant: InputCaptionProps['variant']
  captionShowIcon: boolean
}

const meta: InputStoryMeta<PasswordProps, StoryArgs> = {
  title: 'Form Input/Password',
  tags: ['version:2.0', 'design:pending'],
  component: Password,
  args: {
    labelMode: 'label',
    labelText: 'Пароль',
    placeholder: 'Введите пароль',
    value: '',
    size: 'base',
    state: 'default',
    toggleMask: true,
    clearable: false,
    disabled: false,
    readOnly: false,
    required: false,
    labelInfo: undefined,
    caption: 'Подсказка к полю',
    captionVariant: 'base',
    captionShowIcon: false,
  },
  argTypes: {
    ...inputLabelControls,
    placeholder: { control: 'text' },
    value: { control: 'text' },
    size: { control: 'radio', options: ['small', 'base', 'large', 'xlarge'] },
    state: { control: 'radio', options: ['default', 'danger'] },
    toggleMask: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    caption: { control: 'text' },
    captionVariant: {
      control: 'select',
      options: ['base', 'success', 'warning', 'danger', 'info'],
      if: { arg: 'caption' },
    },
    captionShowIcon: { control: 'boolean', if: { arg: 'caption' } },
    onChangeText: { action: 'onChangeText' },
  },
  parameters: {
    notes: inputDocumentationNotes.Password,
    controls: {
      exclude: [
        'onChangeText',
        'ref',
        'renderTextInput',
        'style',
        'inputStyle',
        'editable',
        'label',
        'floatLabel',
      ],
    },
  },
  render: (args) => {
    const {
      labelMode,
      labelText,
      labelInfo,
      captionVariant,
      captionShowIcon,
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
      <Password
        {...props}
        {...labelProps}
        caption={
          props.caption ? (
            <InputCaption showIcon={captionShowIcon} variant={captionVariant}>
              {props.caption}
            </InputCaption>
          ) : undefined
        }
        value={value}
        onChangeText={onChangeText}
      />
    )
  },
}

export default meta

type Story = StoryObj<StoryArgs>

const PasswordStory: Story = { name: 'Password' }

export { PasswordStory as Password }
