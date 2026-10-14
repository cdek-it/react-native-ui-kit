import { useArgs } from '@storybook/preview-api'
import type { StoryObj } from '@storybook/react'
import { IconSearch } from '@tabler/icons-react-native'
import { useCallback, useEffect, useState } from 'react'

import { Alert } from 'react-native'

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

import { InputGroup, type InputGroupProps } from './InputGroup'
import { InputGroupAddon } from './InputGroupAddon'

const searchOrder = () =>
  Alert.alert('Поиск заказа', 'Нажата кнопка дополнения')
const rightAddons = {
  none: undefined,
  suffix: 'шт.',
  action: (
    <InputGroupAddon
      Icon={IconSearch}
      accessibilityLabel='Найти заказ'
      onPress={searchOrder}
    >
      Найти
    </InputGroupAddon>
  ),
  disabledAction: (
    <InputGroupAddon
      disabled
      Icon={IconSearch}
      accessibilityLabel='Найти заказ'
      onPress={searchOrder}
    >
      Найти
    </InputGroupAddon>
  ),
}

type StoryArgs = Omit<InputLabelStoryArgs<InputGroupProps>, 'rightAddon'> & {
  rightAddon: keyof typeof rightAddons
  captionVariant: InputCaptionProps['variant']
  captionShowIcon: boolean
}

const meta = {
  title: 'Input/InputGroup',
  component: InputGroup,
  args: {
    labelMode: 'none',
    labelText: 'Номер заказа',
    placeholder: 'Введите номер',
    value: '',
    leftAddon: '№',
    rightAddon: 'action',
    size: 'base',
    state: 'default',
    disabled: false,
    readOnly: false,
    clearable: true,
    required: false,
    labelInfo: undefined,
    caption: '',
    captionVariant: 'base',
    captionShowIcon: false,
  },
  argTypes: {
    ...inputLabelControls,
    placeholder: { control: 'text' },
    value: { control: 'text' },
    size: { control: 'radio', options: ['small', 'base', 'large', 'xlarge'] },
    state: { control: 'radio', options: ['default', 'danger'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    clearable: { control: 'boolean' },
    required: { control: 'boolean' },
    leftAddon: { control: 'text' },
    rightAddon: {
      control: 'select',
      options: Object.keys(rightAddons),
      description:
        'InputGroupAddon наследует disabled; readOnly не отключает дополнения.',
    },
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
    notes: inputDocumentationNotes.InputGroup,
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
      rightAddon,
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
      <InputGroup
        {...props}
        {...labelProps}
        caption={
          props.caption ? (
            <InputCaption showIcon={captionShowIcon} variant={captionVariant}>
              {props.caption}
            </InputCaption>
          ) : undefined
        }
        rightAddon={rightAddons[rightAddon]}
        value={value}
        onChangeText={onChangeText}
      />
    )
  },
} satisfies InputStoryMeta<InputGroupProps, StoryArgs>

export default meta

type Story = StoryObj<StoryArgs>

const InputGroupStory: Story = { name: 'InputGroup' }

export { InputGroupStory as InputGroup }
