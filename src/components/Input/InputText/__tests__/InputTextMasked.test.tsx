import {
  act,
  fireEvent,
  render,
  userEvent,
} from '@testing-library/react-native'
import { type ComponentType, createRef, type Ref, type useRef } from 'react'
import type { TextInput, TextInputProps } from 'react-native'
import type { MaskedTextInputProps } from 'react-native-advanced-input-mask'

import { Masked } from '../InputTextMasked.stories'

const MaskedExample = Masked.render
const mockUpdateArgs = jest.fn()

jest.mock('@storybook/preview-api', () => ({
  useArgs: () => [{}, mockUpdateArgs],
}))

jest.mock('react-native-advanced-input-mask', () => {
  const React = jest.requireActual<{ useRef: typeof useRef }>('react')
  const extractedValues: Record<string, string> = {
    '+7 (900) 123-45-67': '9001234567',
    '31/12/2026': '31122026',
    '123-456': '123456',
  }

  return {
    MaskedTextInput: ({
      renderTextInputComponent,
      onChangeText,
      ...props
    }: MaskedTextInputProps) => {
      const nativeRef = React.useRef<TextInput>(null)
      const Control = renderTextInputComponent as ComponentType<
        TextInputProps & { ref?: Ref<TextInput> }
      >

      return (
        <Control
          {...props}
          ref={nativeRef}
          onChangeText={(formatted) =>
            onChangeText?.(formatted, extractedValues[formatted], '', true)
          }
        />
      )
    },
  }
})

const args = {
  labelMode: 'label' as const,
  labelText: 'Телефон',
  mask: '+7 ([000]) [000]-[00]-[00]',
  value: '',
  clearable: true,
}

describe('InputText: пример с маской', () => {
  beforeEach(() => jest.clearAllMocks())

  test('передаёт форматированную строку в Controls и callback, очищает значение', async () => {
    const onChangeText = jest.fn()
    const { getByTestId, getByRole, getByText } = render(
      <MaskedExample {...args} onChangeText={onChangeText} />
    )

    fireEvent.changeText(getByTestId('InputText'), '+7 (900) 123-45-67')

    expect(getByTestId('InputText')).toHaveDisplayValue('+7 (900) 123-45-67')
    expect(mockUpdateArgs).toHaveBeenLastCalledWith({
      value: '+7 (900) 123-45-67',
    })
    expect(onChangeText).toHaveBeenLastCalledWith('+7 (900) 123-45-67')
    expect(
      getByText('Форматированный текст: "+7 (900) 123-45-67"')
    ).toBeOnTheScreen()
    expect(getByText('Извлечённый текст: "9001234567"')).toBeOnTheScreen()

    await userEvent.press(getByRole('button', { name: 'Очистить поле' }))

    expect(getByTestId('InputText')).toHaveDisplayValue('')
    expect(mockUpdateArgs).toHaveBeenLastCalledWith({ value: '' })
    expect(onChangeText).toHaveBeenLastCalledWith('')
    expect(getByText('Форматированный текст: ""')).toBeOnTheScreen()
    expect(getByText('Извлечённый текст: ""')).toBeOnTheScreen()
  })

  test.each([
    { name: 'readOnly', props: { readOnly: true } },
    { name: 'disabled', props: { disabled: true } },
  ])('запрещает редактирование и очистку при $name', ({ props }) => {
    const { getByTestId, queryByRole } = render(
      <MaskedExample {...args} {...props} value='+7 (900) 123-45-67' />
    )

    expect(getByTestId('InputText')).toHaveProp('editable', false)
    expect(getByTestId('InputText')).toHaveProp('readOnly', true)
    expect(queryByRole('button', { name: 'Очистить поле' })).toBeNull()
  })

  test('сохраняет нативные методы ref и обновляет значение из Controls', () => {
    const ref = createRef<TextInput>()
    const onChangeText = jest.fn()
    const { getByTestId, getByText, rerender } = render(
      <MaskedExample {...args} ref={ref} onChangeText={onChangeText} />
    )

    expect(typeof ref.current?.measure).toBe('function')

    rerender(
      <MaskedExample
        {...args}
        ref={ref}
        value='+7 (999) 123-45-67'
        onChangeText={onChangeText}
      />
    )

    expect(getByTestId('InputText')).toHaveDisplayValue('+7 (999) 123-45-67')
    expect(getByText('Форматированный текст: —')).toBeOnTheScreen()
    expect(getByText('Извлечённый текст: —')).toBeOnTheScreen()

    act(() => ref.current?.clear())

    expect(onChangeText).toHaveBeenLastCalledWith('')
    expect(getByTestId('InputText')).toHaveDisplayValue('')
    expect(getByText('Извлечённый текст: ""')).toBeOnTheScreen()
  })

  test.each([
    {
      name: 'дату',
      mask: '[00]/[00]/[0000]',
      formatted: '31/12/2026',
      extracted: '31122026',
    },
    {
      name: 'индекс',
      mask: '[000]-[000]',
      formatted: '123-456',
      extracted: '123456',
    },
  ])(
    'переключает маску на $name, сбрасывает старый extracted и сохраняет нативный ref',
    ({ mask, formatted, extracted }) => {
      const ref = createRef<TextInput>()
      const { getByTestId, getByText, rerender } = render(
        <MaskedExample {...args} ref={ref} />
      )

      fireEvent.changeText(getByTestId('InputText'), '+7 (900) 123-45-67')
      const nativeInput = ref.current

      rerender(<MaskedExample {...args} mask={mask} ref={ref} />)

      expect(getByTestId('InputText')).toHaveProp('mask', mask)
      expect(getByText('Форматированный текст: —')).toBeOnTheScreen()
      expect(getByText('Извлечённый текст: —')).toBeOnTheScreen()
      expect(ref.current).toBe(nativeInput)

      fireEvent.changeText(getByTestId('InputText'), formatted)

      expect(getByTestId('InputText')).toHaveDisplayValue(formatted)
      expect(
        getByText(`Форматированный текст: "${formatted}"`)
      ).toBeOnTheScreen()
      expect(getByText(`Извлечённый текст: "${extracted}"`)).toBeOnTheScreen()
      expect(mockUpdateArgs).toHaveBeenLastCalledWith({ value: formatted })
    }
  )

  test('переключает подпись из Controls, сохраняя введённое значение и нативный ref', () => {
    const ref = createRef<TextInput>()
    const labelArgs = { ...args, labelInfo: { onPress: jest.fn() } }
    const {
      getByDisplayValue,
      getByLabelText,
      getByRole,
      getByTestId,
      queryByTestId,
      queryByRole,
      queryByText,
      rerender,
    } = render(
      <MaskedExample {...labelArgs} ref={ref} testID='MaskedLabelStory' />
    )

    expect(
      getByRole('button', { name: 'Телефон. Подробнее' })
    ).toBeOnTheScreen()

    fireEvent.changeText(getByTestId('MaskedLabelStory'), '+7 (900) 123-45-67')
    const nativeInput = ref.current

    rerender(
      <MaskedExample
        {...labelArgs}
        labelMode='floatLabel'
        ref={ref}
        testID='MaskedLabelStory'
      />
    )

    expect(getByTestId('MaskedLabelStoryFloatingLabel')).toHaveTextContent(
      'Телефон'
    )
    expect(getByLabelText('Телефон')).toHaveDisplayValue('+7 (900) 123-45-67')
    expect(queryByRole('button', { name: 'Телефон. Подробнее' })).toBeNull()
    expect(ref.current).toBe(nativeInput)

    rerender(
      <MaskedExample
        {...labelArgs}
        labelMode='none'
        ref={ref}
        testID='MaskedLabelStory'
      />
    )

    expect(queryByTestId('MaskedLabelStoryFloatingLabel')).toBeNull()
    expect(queryByText('Телефон')).toBeNull()
    expect(ref.current).toBe(nativeInput)
    expect(getByDisplayValue('+7 (900) 123-45-67')).toBeTruthy()
  })
})
