import { render, userEvent } from '@testing-library/react-native'

import { InputCaption, InputText, InputGroup, Password } from '../..'

const components = [
  { name: 'InputText', Component: InputText },
  { name: 'InputGroup', Component: InputGroup },
  { name: 'Password', Component: Password },
]

describe('Input: подпись', () => {
  test.each(components)(
    'передаёт настройки масштабирования обычной подписи в $name',
    ({ Component }) => {
      const { getByText, getByLabelText, rerender } = render(
        <Component allowFontScaling label='Email' maxFontSizeMultiplier={2} />
      )
      const label = getByText('Email', { includeHiddenElements: true })

      expect(label).toHaveProp('allowFontScaling', true)
      expect(label).toHaveProp('maxFontSizeMultiplier', 2)
      expect(getByLabelText('Email')).toHaveProp('allowFontScaling', true)
      expect(getByLabelText('Email')).toHaveProp('maxFontSizeMultiplier', 2)

      rerender(
        <Component
          allowFontScaling={false}
          label='Email'
          maxFontSizeMultiplier={1}
        />
      )

      const updatedLabel = getByText('Email', { includeHiddenElements: true })

      expect(updatedLabel).toHaveProp('allowFontScaling', false)
      expect(updatedLabel).toHaveProp('maxFontSizeMultiplier', 1)
      expect(getByLabelText('Email')).toHaveProp('allowFontScaling', false)
      expect(getByLabelText('Email')).toHaveProp('maxFontSizeMultiplier', 1)
    }
  )

  test.each(components)(
    'сохраняет видимый label без отдельной остановки скринридера в $name',
    ({ Component }) => {
      const { getByLabelText, getByText, queryByRole, queryByText } = render(
        <Component label='Email' />
      )

      expect(getByLabelText('Email')).toHaveDisplayValue('')
      expect(
        getByText('Email', { includeHiddenElements: true })
      ).toBeOnTheScreen()
      expect(queryByText('Email')).toBeNull()
      expect(queryByRole('button', { name: 'Email. Подробнее' })).toBeNull()
    }
  )

  test.each(components)(
    'объединяет label и иконку в одну кнопку при добавлении info в $name',
    async ({ Component }) => {
      const onPress = jest.fn()
      const { getByRole, getAllByRole, getByLabelText, queryByRole, rerender } =
        render(<Component label='Email' testID='InputLabel' />)

      rerender(
        <Component label='Email' labelInfo={{ onPress }} testID='InputLabel' />
      )

      const button = getByRole('button', { name: 'Email. Подробнее' })

      expect(getAllByRole('button', { name: 'Email. Подробнее' })).toHaveLength(
        1
      )
      expect(button).toHaveProp('testID', 'InputLabelLabelInfo')
      expect(queryByRole('text', { name: 'Email' })).toBeNull()
      expect(getByLabelText('Email')).toHaveDisplayValue('')

      await userEvent.press(button)

      expect(onPress).toHaveBeenCalledOnce()

      rerender(<Component label='Email' testID='InputLabel' />)

      expect(queryByRole('button', { name: 'Email. Подробнее' })).toBeNull()
      expect(getByLabelText('Email')).toHaveDisplayValue('')
    }
  )

  test.each(components)(
    'добавляет label к пользовательскому названию действия info в $name',
    ({ Component }) => {
      const { getByRole, getByLabelText } = render(
        <Component
          label='ИНН'
          labelInfo={{
            onPress: jest.fn(),
            accessibilityLabel: 'Как узнать ИНН',
          }}
        />
      )

      expect(
        getByRole('button', { name: 'ИНН. Как узнать ИНН' })
      ).toBeOnTheScreen()
      expect(getByLabelText('ИНН')).toHaveDisplayValue('')
    }
  )

  test.each(components)(
    'не создаёт отдельную остановку для floatLabel в $name',
    ({ Component }) => {
      const { getByLabelText, getByText, queryByText } = render(
        <Component floatLabel='Email' value='name@example.com' />
      )

      expect(getByLabelText('Email')).toHaveDisplayValue('name@example.com')
      expect(
        getByText('Email', { includeHiddenElements: true })
      ).toBeOnTheScreen()
      expect(queryByText('Email')).toBeNull()
    }
  )

  test.each(
    components.flatMap(({ name, Component }) =>
      [undefined, 'Своя подсказка', ''].map((accessibilityHint) => ({
        name: `${name}: hint ${String(accessibilityHint)}`,
        Component,
        accessibilityHint,
      }))
    )
  )(
    'передаёт только заданный hint и сохраняет отдельный Caption в $name',
    ({ Component, accessibilityHint }) => {
      const { getByLabelText, getByRole } = render(
        <Component
          required
          accessibilityHint={accessibilityHint}
          caption={<InputCaption>Введите рабочий email</InputCaption>}
          label='Email'
          labelInfo={{ onPress: jest.fn() }}
        />
      )

      expect(
        getByLabelText('Email, обязательное поле').props.accessibilityHint
      ).toBe(accessibilityHint)
      expect(
        getByRole('text', { name: 'Введите рабочий email' })
      ).toBeOnTheScreen()
      expect(
        getByRole('button', { name: 'Email. Подробнее' }).props
          .accessibilityHint
      ).toBeUndefined()
    }
  )

  test.each([
    { name: 'readOnly', props: { readOnly: true }, disabled: false },
    { name: 'disabled', props: { disabled: true }, disabled: true },
  ])(
    'соблюдает доступность кнопки справки при $name',
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
})
