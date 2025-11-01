import type { Meta, StoryObj } from '@storybook/react'
import {
  type ComponentProps,
  type ComponentType,
  useCallback,
  useState,
} from 'react'
import { View } from 'react-native'
import {
  MaskedTextInput,
  type MaskedTextInputProps,
} from 'react-native-advanced-input-mask'

import { Body } from '../../Typography'
import { FloatLabel } from '../FloatLabel'
import { InputText } from '../InputText'

type InputTextProps = ComponentProps<typeof InputText>

type MaskedInputProps<T extends InputTextProps> = Omit<T, 'onChangeText'> &
  Pick<MaskedTextInputProps, 'onChangeText' | 'mask'> & {
    readonly Control: ComponentType<T>
  }

/**
 * Пример реализации компонента для ввода текста с маской.
 * Основана на пакете react-native-advanced-input-mask
 */
const MaskedInput = <T extends InputTextProps>({
  mask,
  onChangeText: onChangeTextProp,
  Control,
  ...other
}: MaskedInputProps<T>) => {
  const [value, setValue] = useState('')

  // Коллбэк, адаптированный для использования как с MaskedTextInput, так и с дефолтным TextInput
  const onChangeText = useCallback(
    (formatted: string, extracted?: string) => {
      setValue(formatted)
      onChangeTextProp?.(formatted, extracted ?? formatted)
    },
    [onChangeTextProp]
  )

  return (
    <Control
      {...(other as unknown as T)}
      renderTextInput={({ inputRef, value, ...otherRenderTextInputProps }) => (
        <MaskedTextInput
          {...otherRenderTextInputProps}
          mask={mask}
          ref={inputRef}
          onChangeText={onChangeText}
        />
      )}
      value={value}
      // Передаем коллбэк для поддержания дополнительной логики в разных видах контролов. Например, для очистки поля
      onChangeText={onChangeText}
    />
  )
}

const meta: Meta<typeof MaskedInput> = {
  title: 'Input/InputMask',
  args: {
    clearable: true,
    disabled: false,
    state: 'default',
    placeholder: 'Placeholder',
    Control: InputText,
    mask: '+7 ([000]) [000]-[00]-[00]',
  },
  argTypes: {
    state: { control: 'radio', options: ['default', 'danger'] },
    Control: {
      control: 'radio',
      options: ['InputText', 'FloatLabel'],
      mapping: { InputText, FloatLabel },
    },
    mask: {
      control: 'radio',
      options: [
        '+7 ([000]) [000]-[00]-[00]',
        '[00]/[00]/[0000]',
        '[000]-[000]',
      ],
    },
  },
  render: (args) => {
    const [formatted, setFormatted] = useState('')
    const [extracted, setExtracted] = useState('')

    const onChangeText = useCallback((formatted: string, extracted: string) => {
      setFormatted(formatted)
      setExtracted(extracted)
    }, [])

    return (
      <View style={{ gap: 10 }}>
        <Body>Formatted Text: "{formatted}"</Body>
        <Body>Extracted Text: "{extracted}"</Body>
        <MaskedInput {...args} onChangeText={onChangeText} />
      </View>
    )
  },
}

export default meta

type Story = StoryObj<typeof MaskedInput>

const MaskedInputStory: Story = {}

export { MaskedInputStory as InputMask }
