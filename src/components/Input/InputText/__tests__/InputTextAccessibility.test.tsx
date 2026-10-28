import { render, userEvent } from '@testing-library/react-native'
import { TextInput } from 'react-native'

import { InputText, type InputTextProps } from '../InputText'

describe('InputText: базовая доступность', () => {
  test.each<{ name: string; props: InputTextProps; label: string }>([
    { name: 'обычный label', props: { label: 'Email' }, label: 'Email' },
    { name: 'floatLabel', props: { floatLabel: 'Email' }, label: 'Email' },
    {
      name: 'placeholder без label',
      props: { placeholder: 'Email' },
      label: 'Email',
    },
    {
      name: 'явное имя поля',
      props: { label: 'Email', accessibilityLabel: 'Рабочий email' },
      label: 'Рабочий email',
    },
  ])('сохраняет имя поля: $name', ({ props, label }) => {
    const { getByLabelText } = render(
      <InputText {...props} value='name@example.com' />
    )

    expect(getByLabelText(label)).toHaveDisplayValue('name@example.com')
  })

  test('скрывает визуальный floatLabel и placeholder от скринридера', () => {
    const { getByLabelText, getByText, queryByRole, rerender } = render(
      <InputText floatLabel='Email' placeholder='name@example.com' />
    )

    expect(getByLabelText('Email')).toHaveDisplayValue('')
    expect(queryByRole('text', { name: 'Email' })).toBeNull()
    expect(
      getByText('Email', { includeHiddenElements: true })
    ).toBeOnTheScreen()

    rerender(<InputText label='Email' placeholder='name@example.com' />)

    expect(getByLabelText('Email')).toHaveDisplayValue('')
    expect(queryByRole('text', { name: 'name@example.com' })).toBeNull()
    expect(
      getByText('name@example.com', { includeHiddenElements: true })
    ).toBeOnTheScreen()
  })

  test('обновляет disabled, сохраняя остальные состояния доступности', () => {
    const { getByLabelText, rerender } = render(
      <InputText disabled accessibilityState={{ busy: true }} label='Email' />
    )

    expect(getByLabelText('Email')).toHaveProp('accessibilityState', {
      busy: true,
      disabled: true,
    })

    rerender(
      <InputText readOnly accessibilityState={{ busy: true }} label='Email' />
    )

    expect(getByLabelText('Email')).toHaveProp('accessibilityState', {
      busy: true,
      disabled: false,
    })
    expect(getByLabelText('Email')).toHaveProp('editable', false)
  })

  test('передаёт имя и состояние доступности в renderTextInput', () => {
    const { getByLabelText } = render(
      <InputText
        disabled
        label='Телефон'
        renderTextInput={({ inputRef, ...props }) => (
          <TextInput {...props} ref={inputRef} />
        )}
      />
    )

    expect(getByLabelText('Телефон')).toHaveProp('accessibilityState', {
      disabled: true,
    })
  })

  test.each([
    {
      name: 'имя по умолчанию',
      accessibilityLabel: undefined,
      label: 'ИНН. Подробнее',
    },
    {
      name: 'явное имя',
      accessibilityLabel: 'Как узнать ИНН',
      label: 'ИНН. Как узнать ИНН',
    },
  ])('озвучивает кнопку info: $name', async ({ accessibilityLabel, label }) => {
    const onPress = jest.fn()
    const { getByRole } = render(
      <InputText label='ИНН' labelInfo={{ onPress, accessibilityLabel }} />
    )
    const button = getByRole('button', { name: label })

    expect(button).toHaveProp('accessibilityState', { disabled: false })

    await userEvent.press(button)

    expect(onPress).toHaveBeenCalledOnce()
  })

  test.each([
    { name: 'readOnly', props: { readOnly: true }, disabled: false },
    { name: 'disabled', props: { disabled: true }, disabled: true },
  ])(
    'соблюдает состояние кнопки info при $name',
    async ({ props, disabled }) => {
      const onPress = jest.fn()
      const { getByRole } = render(
        <InputText {...props} label='Email' labelInfo={{ onPress }} />
      )
      const button = getByRole('button', { name: 'Email. Подробнее' })

      expect(button).toHaveProp('accessibilityState', { disabled })

      await userEvent.press(button)

      expect(onPress).toHaveBeenCalledTimes(disabled ? 0 : 1)
    }
  )

  test('различает контекст и testID кнопок info у разных полей', () => {
    const { getByRole } = render(
      <>
        <InputText
          label='Email'
          labelInfo={{ onPress: jest.fn() }}
          testID='EmailInput'
        />
        <InputText
          label='Телефон'
          labelInfo={{ onPress: jest.fn() }}
          testID='PhoneInput'
        />
      </>
    )

    expect(getByRole('button', { name: 'Email. Подробнее' })).toHaveProp(
      'testID',
      'EmailInputLabelInfo'
    )
    expect(getByRole('button', { name: 'Телефон. Подробнее' })).toHaveProp(
      'testID',
      'PhoneInputLabelInfo'
    )
  })
})
