import { IconCircleX } from '@tabler/icons-react-native'
import {
  act,
  fireEvent,
  render,
  userEvent,
} from '@testing-library/react-native'
import { createRef, useImperativeHandle } from 'react'
import { TextInput } from 'react-native'

import { InputText, InputCaption, type RenderTextInputArgs } from '../..'

describe('InputText: новый API', () => {
  test('разделяет label, placeholder и произвольный caption', () => {
    const { getByText, queryByRole, getByTestId } = render(
      <InputText
        required
        caption={
          <InputCaption Icon={IconCircleX} variant='danger'>
            Неверный номер
          </InputCaption>
        }
        label='Телефон'
        placeholder='+7 999'
      />
    )

    expect(getByTestId('InputText')).toHaveProp(
      'accessibilityLabel',
      'Телефон, обязательное поле'
    )
    expect(
      getByText('+7 999', { includeHiddenElements: true })
    ).toBeOnTheScreen()
    expect(
      getByText('Неверный номер', { includeHiddenElements: true })
    ).toBeOnTheScreen()
    expect(queryByRole('button')).not.toBeOnTheScreen()
  })

  test('отображает caption и обычный label, сохраняя имя поля для скринридера', () => {
    const { getByLabelText, getByText, queryByRole } = render(
      <InputText
        accessibilityLabel='Контактный телефон'
        caption='Получит уведомление'
        label='Телефон'
      />
    )

    expect(getByLabelText('Контактный телефон')).toHaveDisplayValue('')
    expect(queryByRole('text', { name: 'Телефон' })).toBeNull()
    expect(
      getByText('Телефон', { includeHiddenElements: true })
    ).toBeOnTheScreen()
    expect(
      getByText('Получит уведомление', { includeHiddenElements: true })
    ).toBeOnTheScreen()
  })

  test('инициализирует defaultValue один раз и обновляет неконтролируемое поле', async () => {
    const onChangeText = jest.fn()
    const { getByRole, rerender, getByTestId } = render(
      <InputText
        defaultValue='Москва'
        label='Адрес'
        onChangeText={onChangeText}
      />
    )

    expect(getByTestId('InputText')).toHaveDisplayValue('Москва')

    fireEvent.changeText(getByTestId('InputText'), 'Казань')
    rerender(
      <InputText
        defaultValue='Тула'
        label='Адрес'
        onChangeText={onChangeText}
      />
    )

    expect(getByTestId('InputText')).toHaveDisplayValue('Казань')

    await userEvent.press(getByRole('button', { name: 'Очистить поле' }))

    expect(onChangeText).toHaveBeenLastCalledWith('')
    expect(getByTestId('InputText')).toHaveDisplayValue('')
  })

  test('сохраняет renderer, стандартный ref и callback очистки controlled value', () => {
    const focus = jest.fn()
    const onChangeText = jest.fn()
    const ref = createRef<TextInput>()
    const CustomInput = ({ inputRef, ...props }: RenderTextInputArgs) => {
      useImperativeHandle(inputRef, () => ({ focus }) as unknown as TextInput)

      return <TextInput {...props} />
    }
    const { rerender, getByTestId } = render(
      <InputText
        label='Маска'
        ref={ref}
        renderTextInput={(props) => <CustomInput {...props} />}
        value='123'
        onChangeText={onChangeText}
      />
    )
    act(() => {
      ref.current?.focus()
      ref.current?.clear()
    })

    expect(focus).toHaveBeenCalledOnce()
    expect(onChangeText).toHaveBeenLastCalledWith('')
    expect(getByTestId('InputText')).toHaveDisplayValue('123')

    rerender(
      <InputText
        label='Маска'
        ref={ref}
        renderTextInput={(props) => <CustomInput {...props} />}
        value=''
        onChangeText={onChangeText}
      />
    )

    expect(getByTestId('InputText')).toHaveDisplayValue('')
  })

  test('сохраняет отдельную подсказку и callbacks при фокусе floating label', () => {
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    const { getByLabelText, getByTestId, rerender } = render(
      <InputText
        floatLabel='Email'
        placeholder='name@example.com'
        value=''
        onBlur={onBlur}
        onFocus={onFocus}
      />
    )
    const input = getByLabelText('Email')

    expect(
      getByTestId('InputTextPlaceholder', { includeHiddenElements: true })
    ).toBeOnTheScreen()

    fireEvent(input, 'focus', { nativeEvent: {} })

    expect(input).toHaveProp('placeholder', '')

    fireEvent(input, 'blur', { nativeEvent: {} })

    expect(
      getByTestId('InputTextPlaceholder', { includeHiddenElements: true })
    ).toBeOnTheScreen()
    expect(onFocus).toHaveBeenCalledOnce()
    expect(onBlur).toHaveBeenCalledOnce()

    rerender(
      <InputText
        floatLabel='Email'
        placeholder='name@example.com'
        value='a@b.ru'
      />
    )

    expect(getByLabelText('Email')).toHaveDisplayValue('a@b.ru')
    expect(getByTestId('InputTextFloatingLabel')).toBeOnTheScreen()
  })

  test.each([
    { name: 'disabled', props: { disabled: true }, disabled: true },
    { name: 'readOnly', props: { readOnly: true }, disabled: false },
    {
      name: 'disabled при readOnly=false',
      props: { disabled: true, readOnly: false },
      disabled: true,
    },
  ])('нормализует renderer при $name', ({ props, disabled }) => {
    const { queryByRole, getByTestId } = render(
      <InputText
        {...props}
        label='Поле'
        renderTextInput={({ inputRef, ...inputProps }) => (
          <TextInput {...inputProps} ref={inputRef} />
        )}
        value='Текст'
      />
    )

    expect(getByTestId('InputText')).toHaveProp('editable', false)
    expect(getByTestId('InputText')).toHaveProp('accessibilityState', {
      disabled,
    })
    expect(queryByRole('button')).not.toBeOnTheScreen()
  })

  test('при вводе controlled value вызывает callback и ждёт обновления props', () => {
    const onChangeText = jest.fn()
    const { rerender, getByTestId } = render(
      <InputText label='Адрес' value='Москва' onChangeText={onChangeText} />
    )

    fireEvent.changeText(getByTestId('InputText'), 'Казань')

    expect(onChangeText).toHaveBeenCalledOnce()
    expect(onChangeText).toHaveBeenCalledWith('Казань')
    expect(getByTestId('InputText')).toHaveDisplayValue('Москва')

    rerender(
      <InputText label='Адрес' value='Казань' onChangeText={onChangeText} />
    )

    expect(getByTestId('InputText')).toHaveDisplayValue('Казань')
  })

  test('clearable=false убирает очистку, а пустое controlled value скрывает её после обновления', async () => {
    const onChangeText = jest.fn()
    const { getByRole, queryByRole, rerender, getByTestId } = render(
      <InputText
        clearable={false}
        label='Адрес'
        value='Москва'
        onChangeText={onChangeText}
      />
    )

    expect(queryByRole('button', { name: 'Очистить поле' })).toBeNull()

    rerender(
      <InputText label='Адрес' value='Москва' onChangeText={onChangeText} />
    )
    await userEvent.press(getByRole('button', { name: 'Очистить поле' }))

    expect(onChangeText).toHaveBeenCalledOnce()
    expect(onChangeText).toHaveBeenCalledWith('')
    expect(getByTestId('InputText')).toHaveDisplayValue('Москва')

    rerender(<InputText label='Адрес' value='' onChangeText={onChangeText} />)

    expect(queryByRole('button', { name: 'Очистить поле' })).toBeNull()
    expect(onChangeText).toHaveBeenCalledOnce()
  })

  test('сохраняет нативные методы адаптера и очищает uncontrolled value через ref', async () => {
    const ref = createRef<TextInput>()
    const onChangeText = jest.fn()
    const nativeInput = {
      focus: jest.fn(),
      blur: jest.fn(),
      isFocused: jest.fn(() => true),
    }
    const CustomInput = ({ inputRef, ...props }: RenderTextInputArgs) => {
      useImperativeHandle(inputRef, () => nativeInput as unknown as TextInput)

      return <TextInput {...props} />
    }
    const { getByTestId, queryByRole } = render(
      <InputText
        defaultValue='Москва'
        label='Адрес'
        ref={ref}
        renderTextInput={(props) => <CustomInput {...props} />}
        onChangeText={onChangeText}
      />
    )

    await userEvent.press(getByTestId('InputTextFrame'))

    expect(nativeInput.focus).toHaveBeenCalledOnce()

    act(() => {
      ref.current?.blur()

      expect(ref.current?.isFocused()).toBeTrue()

      ref.current?.clear()
    })

    expect(nativeInput.blur).toHaveBeenCalledOnce()
    expect(onChangeText).toHaveBeenCalledOnce()
    expect(onChangeText).toHaveBeenCalledWith('')
    expect(getByTestId('InputText')).toHaveDisplayValue('')
    expect(queryByRole('button', { name: 'Очистить поле' })).toBeNull()
  })

  test('убирает пустой caption и сохраняет число 0 при обновлении подписи', () => {
    const { getByText, queryByTestId, rerender } = render(
      <InputText caption='Описание' label='Адрес' />
    )

    expect(
      getByText('Описание', { includeHiddenElements: true })
    ).toBeOnTheScreen()

    rerender(<InputText caption='' label='Адрес' />)

    expect(queryByTestId('InputCaption')).toBeNull()

    rerender(<InputText caption={0} label='Адрес' />)

    expect(getByText('0', { includeHiddenElements: true })).toBeOnTheScreen()

    rerender(<InputText label='Адрес' />)

    expect(queryByTestId('InputCaption')).toBeNull()
  })

  test('сохраняет переданное доступное состояние, нормализуя только disabled', () => {
    const { getByTestId } = render(
      <InputText
        disabled
        accessibilityState={{ busy: true, selected: true, disabled: false }}
        label='Адрес'
      />
    )

    expect(getByTestId('InputText')).toHaveProp('accessibilityState', {
      busy: true,
      selected: true,
      disabled: true,
    })
  })
})
