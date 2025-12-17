import type { Meta, StoryObj } from '@storybook/react'
import {
  type ComponentProps,
  type ComponentType,
  type RefObject,
  useCallback,
  useState,
} from 'react'
import { View } from 'react-native'
import {
  MaskedTextInput,
  type MaskedTextInputProps,
  type MaskedTextInputRef,
} from 'react-native-advanced-input-mask'

import { Body } from '../../Typography'
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
    (
      formatted: string,
      extracted: string,
      tailPlacehilder: string,
      complete: boolean
    ) => {
      setValue(formatted)
      onChangeTextProp?.(
        formatted,
        extracted ?? formatted,
        tailPlacehilder,
        complete
      )
    },
    [onChangeTextProp]
  )

  return (
    <InputText
      {...(other as unknown as T)}
      renderTextInput={({ inputRef, value, ...otherRenderTextInputProps }) => (
        <MaskedTextInput
          {...otherRenderTextInputProps}
          mask={mask}
          ref={inputRef as unknown as RefObject<MaskedTextInputRef>}
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
  title: 'Form/InputMask',
  args: {
    clearable: true,
    disabled: false,
    state: 'default',
    placeholder: 'Placeholder',
    floatLabel: false,
    mask: '+7 ([000]) [000]-[00]-[00]',
    size: 'base',
  },
  argTypes: {
    state: { control: 'radio', options: ['default', 'danger'] },
    size: { control: 'radio', options: ['base', 'large', 'xlarge'] },
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
