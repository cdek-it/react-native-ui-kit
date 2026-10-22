import { act, fireEvent, render } from '@testing-library/react-native'
import { createRef, useImperativeHandle, useRef } from 'react'
import { TextInput } from 'react-native'

import type {
  InputTextPrivateProps,
  RenderTextInputArgs,
} from '../InputTextBase/types'
import {
  LegacyInputText as InputText,
  type LegacyInputTextProps as InputTextProps,
} from '../LegacyInputText'

describe('LegacyInputText', () => {
  test.each(['medium', 1, 64] as const)(
    'сохраняет ввод при legacy-размере %s',
    (size) => {
      const onChangeText = jest.fn()
      const { getByLabelText } = render(
        <InputText placeholder='Поле' size={size} onChangeText={onChangeText} />
      )

      fireEvent.changeText(getByLabelText('Поле'), 'Текст')

      expect(onChangeText).toHaveBeenCalledWith('Текст')
      expect(getByLabelText('Поле')).toHaveDisplayValue('Текст')
    }
  )

  test('сохраняет выбранную видимость пароля при смене secureTextEntry', () => {
    const { getByLabelText, getByTestId, queryByTestId, rerender } = render(
      <InputText placeholder='Пароль' secureTextEntry='toggleable' />
    )

    fireEvent.press(getByTestId('InputTextBaseSecureInputButton'))

    expect(getByLabelText('Пароль')).toHaveProp('secureTextEntry', false)

    rerender(<InputText secureTextEntry placeholder='Пароль' />)

    expect(getByLabelText('Пароль')).toHaveProp('secureTextEntry', true)
    expect(
      queryByTestId('InputTextBaseSecureInputButton')
    ).not.toBeOnTheScreen()

    rerender(<InputText placeholder='Пароль' secureTextEntry='toggleable' />)

    expect(getByLabelText('Пароль')).toHaveProp('secureTextEntry', false)
  })

  test('использует актуальный callback после rerender при вводе и очистке через ref', () => {
    const inputRef = createRef<TextInput>()
    const initialOnChangeText = jest.fn()
    const nextOnChangeText = jest.fn()
    const { getByLabelText, rerender } = render(
      <InputText
        inputRef={inputRef}
        placeholder='Поле'
        onChangeText={initialOnChangeText}
      />
    )

    fireEvent.changeText(getByLabelText('Поле'), 'Первое')

    expect(initialOnChangeText).toHaveBeenCalledWith('Первое')

    rerender(
      <InputText
        inputRef={inputRef}
        placeholder='Поле'
        onChangeText={nextOnChangeText}
      />
    )

    expect(getByLabelText('Поле')).toHaveDisplayValue('Первое')

    fireEvent.changeText(getByLabelText('Поле'), 'Второе')

    expect(nextOnChangeText).toHaveBeenCalledWith('Второе')

    act(() => inputRef.current?.clear())

    expect(nextOnChangeText).toHaveBeenLastCalledWith('')
    expect(initialOnChangeText).toHaveBeenCalledOnce()
    expect(getByLabelText('Поле')).toHaveDisplayValue('')
  })

  test('сохраняет prefix testID и независимость правых кнопок', () => {
    const onChangeText = jest.fn()
    const props: InputTextProps & InputTextPrivateProps = {
      floatLabel: true,
      loading: true,
      clearButtonAccessibilityLabel: 'Очистить пароль',
      placeholder: 'Пароль',
      secureTextEntry: 'toggleable',
      testID: 'PasswordField',
      value: 'Текст',
      onChangeText,
    }
    const { getByLabelText, getByRole, getByTestId } = render(
      <InputText {...props} />
    )

    expect(getByTestId('PasswordFieldLoading')).toBeOnTheScreen()
    expect(
      getByTestId('PasswordFieldFloatingPlaceholder', {
        includeHiddenElements: true,
      })
    ).toHaveTextContent('Пароль')

    fireEvent.press(getByTestId('PasswordFieldSecureInputButton'))

    expect(getByLabelText('Пароль')).toHaveProp('secureTextEntry', false)
    expect(onChangeText).not.toHaveBeenCalled()

    fireEvent.press(getByRole('button', { name: 'Очистить пароль' }))

    expect(onChangeText).toHaveBeenCalledWith('')
    expect(getByLabelText('Пароль')).toHaveDisplayValue('Текст')
  })

  test('сохраняет неуправляемое значение, фокус и ref при смене пути рендера', () => {
    const inputRef = createRef<TextInput>()
    const onChangeText = jest.fn()
    const CustomInput = ({ inputRef: ref, ...props }: RenderTextInputArgs) => {
      const focused = useRef(false)
      useImperativeHandle(
        ref,
        () =>
          ({
            focus: () => {
              focused.current = true
            },
            isFocused: () => focused.current,
          }) as unknown as TextInput
      )

      return <TextInput {...props} />
    }
    const props: InputTextProps = {
      inputRef,
      placeholder: 'Поле',
      renderTextInput: (args) => <CustomInput {...args} />,
      onChangeText,
    }
    const { getByLabelText, rerender } = render(<InputText {...props} />)

    fireEvent.changeText(getByLabelText('Поле'), 'Текст')
    act(() => inputRef.current?.focus())

    expect(inputRef.current?.isFocused()).toBeTrue()

    for (const size of ['medium', 64, 'large'] as const) {
      rerender(<InputText {...props} size={size} />)

      expect(getByLabelText('Поле')).toHaveDisplayValue('Текст')
      expect(inputRef.current?.isFocused()).toBeTrue()
    }

    rerender(<InputText {...props} secureTextEntry='toggleable' />)

    expect(getByLabelText('Поле')).toHaveDisplayValue('Текст')
    expect(inputRef.current?.isFocused()).toBeTrue()

    act(() => inputRef.current?.clear())

    expect(onChangeText).toHaveBeenLastCalledWith('')
    expect(getByLabelText('Поле')).toHaveDisplayValue('')
  })

  test('переключает legacy-пароль без изменения значения', () => {
    const { getByLabelText, getByTestId } = render(
      <InputText
        placeholder='Пароль'
        secureTextEntry='toggleable'
        value='Пароль'
      />
    )
    const input = getByLabelText('Пароль')
    const toggle = getByTestId('InputTextBaseSecureInputButton')

    expect(input).toHaveProp('secureTextEntry', true)

    fireEvent.press(toggle)

    expect(input).toHaveProp('secureTextEntry', false)
    expect(input).toHaveDisplayValue('Пароль')

    fireEvent.press(toggle)

    expect(input).toHaveProp('secureTextEntry', true)
  })
})
