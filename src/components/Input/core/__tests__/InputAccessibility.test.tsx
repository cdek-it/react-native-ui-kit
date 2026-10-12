import { render } from '@testing-library/react-native'

import { InputText, InputGroup, Password } from '../..'

const components = [
  { name: 'InputText', Component: InputText },
  { name: 'InputGroup', Component: InputGroup },
  { name: 'Password', Component: Password },
]

describe('Input: доступное имя и состояние', () => {
  test.each(
    components.flatMap(({ name, Component }) => [
      { name: `${name}: label`, Component, labelProps: { label: 'Email' } },
      {
        name: `${name}: floatLabel`,
        Component,
        labelProps: { floatLabel: 'Email' },
      },
    ])
  )(
    'обновляет маркер и доступную обязательность в $name',
    ({ Component, labelProps }) => {
      const { getByText, getByTestId, queryByText, rerender } = render(
        <Component {...labelProps} required testID='RequiredInput' />
      )

      expect(
        getByText('*', { includeHiddenElements: true })
      ).toBeOnTheScreen()
      expect(getByTestId('RequiredInput')).toHaveProp(
        'accessibilityLabel',
        'Email, обязательное поле'
      )

      rerender(
        <Component {...labelProps} required={false} testID='RequiredInput' />
      )

      expect(queryByText('*', { includeHiddenElements: true })).toBeNull()
      expect(
        getByText('Email', { includeHiddenElements: true })
      ).toBeOnTheScreen()
      expect(getByTestId('RequiredInput')).toHaveProp(
        'accessibilityLabel',
        'Email'
      )
      expect(
        getByTestId('RequiredInput').props.accessibilityHint
      ).toBeUndefined()
    }
  )

  test.each(components)(
    'доступен без label и floatLabel в $name',
    ({ Component }) => {
      const { getByLabelText, queryByTestId, queryByRole } = render(
        <Component
          required
          placeholder='Введите email'
          testID='UnlabeledInput'
        />
      )

      expect(
        getByLabelText('Введите email, обязательное поле')
      ).toHaveDisplayValue('')
      expect(getByLabelText('Введите email, обязательное поле')).toHaveProp(
        'accessibilityLabel',
        'Введите email, обязательное поле'
      )
      expect(queryByTestId('UnlabeledInputFloatingLabel')).toBeNull()
      expect(queryByRole('button', { name: 'Email. Подробнее' })).toBeNull()
    }
  )

  test.each([
    {
      name: 'accessibilityLabel',
      props: { accessibilityLabel: 'Контактный email' },
    },
    {
      name: 'aria-label',
      props: {
        'aria-label': 'Контактный email',
        accessibilityLabel: 'Запасное имя',
      },
    },
  ])(
    'сохраняет обязательность при явном имени $name и отключённом hint',
    ({ props }) => {
      const { getByLabelText, rerender } = render(
        <InputText {...props} required accessibilityHint='' label='Email' />
      )

      expect(getByLabelText('Контактный email, обязательное поле')).toHaveProp(
        'accessibilityHint',
        ''
      )

      rerender(<InputText {...props} accessibilityHint='' label='Email' />)

      expect(getByLabelText('Контактный email')).toHaveProp(
        'accessibilityHint',
        ''
      )
    }
  )

  test.each(components)(
    'вычисляет доступный disabled только из disabled компонента в $name',
    ({ Component }) => {
      const aliasedProps = { 'aria-disabled': false }
      const { getByLabelText, rerender } = render(
        <Component
          {...aliasedProps}
          disabled
          accessibilityState={{ busy: true }}
          label='Email'
        />
      )

      expect(getByLabelText('Email')).toHaveProp('accessibilityState', {
        disabled: true,
        busy: true,
      })

      rerender(
        <Component
          {...{ 'aria-disabled': true }}
          accessibilityState={{ busy: true }}
          label='Email'
        />
      )

      expect(getByLabelText('Email')).toHaveProp('accessibilityState', {
        disabled: false,
        busy: true,
      })
    }
  )
})
