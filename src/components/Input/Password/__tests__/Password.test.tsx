import { fireEvent, render, userEvent } from '@testing-library/react-native'

import { Password } from '../..'

describe('Password', () => {
  test.each([
    {
      name: 'controlled поля',
      readOnly: false,
      valueProps: { value: 'secret' },
    },
    {
      name: 'controlled readOnly поля',
      readOnly: true,
      valueProps: { value: 'secret' },
    },
    {
      name: 'uncontrolled поля',
      readOnly: false,
      valueProps: { defaultValue: 'secret' },
    },
    {
      name: 'uncontrolled readOnly поля',
      readOnly: true,
      valueProps: { defaultValue: 'secret' },
    },
  ])(
    'сохраняет переключение видимости после blur для $name',
    async ({ readOnly, valueProps }) => {
      const onChangeText = jest.fn()
      const { getByRole, queryByRole, getByTestId } = render(
        <Password
          {...valueProps}
          label='Пароль'
          readOnly={readOnly}
          onChangeText={onChangeText}
        />
      )

      expect(getByTestId('Password')).toHaveProp('autoCapitalize', 'none')
      expect(getByTestId('Password')).toHaveProp('autoCorrect', false)
      expect(getByTestId('Password')).toHaveProp('secureTextEntry', true)
      expect(getByTestId('Password')).toHaveProp('editable', !readOnly)
      expect(
        queryByRole('button', { name: 'Очистить поле' })
      ).not.toBeOnTheScreen()

      await userEvent.press(getByRole('button', { name: 'Показать пароль' }))

      expect(getByTestId('Password')).toHaveProp('secureTextEntry', false)

      fireEvent(getByTestId('Password'), 'blur', { nativeEvent: {} })
      fireEvent(getByTestId('Password'), 'focus', { nativeEvent: {} })

      expect(getByTestId('Password')).toHaveDisplayValue('secret')
      expect(getByTestId('Password')).toHaveProp('secureTextEntry', false)
      expect(onChangeText).not.toHaveBeenCalled()

      await userEvent.press(getByRole('button', { name: 'Скрыть пароль' }))

      expect(getByTestId('Password')).toHaveProp('secureTextEntry', true)
    }
  )

  test('отключает глаз вместе с полем', async () => {
    const { getByRole, getByLabelText } = render(
      <Password
        disabled
        accessibilityLabel='Пароль для входа'
        accessibilityState={{ busy: true }}
        label='Пароль'
        testID='LoginPassword'
      />
    )
    const field = getByLabelText('Пароль для входа')
    const button = getByRole('button', { name: 'Показать пароль' })

    expect(field).toHaveProp('testID', 'LoginPassword')
    expect(field).toHaveProp('accessibilityState', {
      busy: true,
      disabled: true,
    })
    expect(button).toHaveProp('testID', 'LoginPasswordToggleMask')
    expect(button).toHaveProp('accessibilityState', { disabled: true })

    await userEvent.press(button)

    expect(field).toHaveProp('secureTextEntry', true)
  })

  test('очищает controlled value отдельным действием и скрывает toggle по запросу', async () => {
    const onChangeText = jest.fn()
    const { getByRole, queryByRole, getByTestId, rerender } = render(
      <Password
        clearable
        label='Пароль'
        toggleMask={false}
        value='secret'
        onChangeText={onChangeText}
      />
    )

    expect(
      queryByRole('button', { name: 'Показать пароль' })
    ).not.toBeOnTheScreen()

    await userEvent.press(getByRole('button', { name: 'Очистить поле' }))

    expect(onChangeText).toHaveBeenCalledWith('')
    expect(getByTestId('Password')).toHaveDisplayValue('secret')

    rerender(
      <Password
        clearable
        label='Пароль'
        toggleMask={false}
        value=''
        onChangeText={onChangeText}
      />
    )

    expect(getByTestId('Password')).toHaveDisplayValue('')
    expect(
      queryByRole('button', { name: 'Очистить поле' })
    ).not.toBeOnTheScreen()
  })

  test('disabled блокирует переключение без сброса видимости, readOnly сохраняет действие', async () => {
    const { getByRole, rerender, getByTestId } = render(
      <Password label='Пароль' value='secret' />
    )
    await userEvent.press(getByRole('button', { name: 'Показать пароль' }))

    rerender(<Password disabled label='Пароль' value='secret' />)
    const button = getByRole('button', { name: 'Скрыть пароль' })

    expect(button).toHaveProp('accessibilityState', { disabled: true })

    await userEvent.press(button)

    expect(getByTestId('Password')).toHaveProp('secureTextEntry', false)

    rerender(<Password readOnly label='Пароль' value='secret' />)
    await userEvent.press(getByRole('button', { name: 'Скрыть пароль' }))

    expect(getByTestId('Password')).toHaveProp('editable', false)
    expect(getByTestId('Password')).toHaveProp('secureTextEntry', true)
    expect(getByTestId('Password')).toHaveDisplayValue('secret')
  })
})
