import { useArgs } from '@storybook/preview-api'
import type { StoryObj } from '@storybook/react'
import {
  createContext,
  type Ref,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { TextInput, View, type TextInputProps } from 'react-native'
import { MaskedTextInput } from 'react-native-advanced-input-mask'
import { StyleSheet } from 'react-native-unistyles'

import {
  getInputLabelProps,
  type InputLabelStoryArgs,
  type InputStoryMeta,
} from '../../../../.storybook/inputLabelControls'
import { Body } from '../../Typography'
import type { RenderTextInputArgs } from '../core/types'

import { InputText, type InputTextProps } from './InputText'
import inputTextMeta from './InputText.stories'

type StoryArgs = InputLabelStoryArgs<InputTextProps> & { mask: string }

const NativeInputRefContext = createContext<Ref<TextInput>>(null)

const NativeInput = ({
  ref: maskedRef,
  ...props
}: TextInputProps & { readonly ref?: Ref<TextInput> }) => {
  const inputRef = useContext(NativeInputRefContext)
  const nativeRef = useRef<TextInput>(null)

  // У MaskedTextInput свой ограниченный ref; InputText сохраняет нативный TextInput.
  useImperativeHandle<TextInput | null, TextInput | null>(
    inputRef,
    () => nativeRef.current
  )
  useImperativeHandle<TextInput | null, TextInput | null>(
    maskedRef,
    () => nativeRef.current
  )

  return <TextInput {...props} ref={nativeRef} />
}

const MaskedControl = ({
  inputRef,
  onChangeText,
  onMaskResult,
  ...props
}: RenderTextInputArgs & {
  readonly mask: string
  readonly onMaskResult: (formatted: string, extracted: string) => void
}) => (
  <NativeInputRefContext.Provider value={inputRef}>
    <MaskedTextInput
      {...props}
      autocomplete={false}
      autocompleteOnFocus={false}
      renderTextInputComponent={NativeInput}
      onChangeText={(formatted, extracted) => {
        onMaskResult(formatted, extracted)
        onChangeText?.(formatted)
      }}
    />
  </NativeInputRefContext.Provider>
)

const meta = {
  ...inputTextMeta,
  title: 'Input/Input Text With Mask',
  tags: ['version:2.0', 'design:pending'],
  args: {
    ...inputTextMeta.args,
    labelText: 'Значение',
    placeholder: 'Введите значение',
    caption: '',
    mask: '+7 ([000]) [000]-[00]-[00]',
  },
  argTypes: {
    ...inputTextMeta.argTypes,
    mask: {
      control: 'radio',
      options: [
        '+7 ([000]) [000]-[00]-[00]',
        '[00]/[00]/[0000]',
        '[000]-[000]',
      ],
      description:
        'Параметр примера для стороннего MaskedTextInput; не свойство InputText.',
    },
  },
  parameters: {
    ...inputTextMeta.parameters,
    controls: {
      include: [...inputTextMeta.parameters.controls.include, 'mask'],
    },
    docs: {
      description: {
        component:
          'Маска подключена через renderTextInput. Ниже отображаются formatted и extracted из события маски. После изменения value или mask в Controls результаты доступны при следующем вводе.',
      },
    },
  },
} satisfies InputStoryMeta<InputTextProps, StoryArgs>

export default meta

const MaskedStory = {
  name: 'Input Text With Mask',
  render: (args: StoryArgs) => {
    const {
      labelMode,
      labelText,
      labelInfo,
      mask,
      onChangeText: onChangeTextAction,
      ...props
    } = args
    const labelProps = getInputLabelProps({ labelMode, labelText, labelInfo })
    const [, updateArgs] = useArgs()
    const [value, setValue] = useState(props.value)
    const [maskResult, setMaskResult] = useState<{
      mask: string
      formatted: string
      extracted: string
    }>()

    useEffect(() => setValue(props.value), [props.value])

    const result = value
      ? maskResult?.mask === mask && maskResult.formatted === value
        ? maskResult
        : undefined
      : { formatted: '', extracted: '' }

    const onChangeText = useCallback(
      (nextValue: string) => {
        setValue(nextValue)
        updateArgs({ value: nextValue })
        onChangeTextAction?.(nextValue)
      },
      [onChangeTextAction, updateArgs]
    )

    return (
      <View style={styles.example}>
        <InputText
          {...props}
          {...labelProps}
          keyboardType='phone-pad'
          renderTextInput={(inputProps) => (
            <MaskedControl
              {...inputProps}
              mask={mask}
              onMaskResult={(formatted, extracted) =>
                setMaskResult({ mask, formatted, extracted })
              }
            />
          )}
          value={value}
          onChangeText={onChangeText}
        />
        <View style={styles.values}>
          <Body size='base'>
            Форматированный текст: {result ? `"${result.formatted}"` : '—'}
          </Body>
          <Body size='base'>
            Извлечённый текст: {result ? `"${result.extracted}"` : '—'}
          </Body>
        </View>
      </View>
    )
  },
} satisfies StoryObj<StoryArgs>

export { MaskedStory as Masked }

const styles = StyleSheet.create(({ semantic }) => ({
  example: { gap: semantic.dimension.space[200] },
  values: { gap: semantic.dimension.space[100] },
}))
