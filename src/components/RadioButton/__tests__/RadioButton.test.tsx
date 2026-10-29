import { fireEvent, render, userEvent } from '@testing-library/react-native'

import { RadioButton, type RadioButtonProps } from '..'

describe('RadioButton', () => {
  test.each([false, true])(
    'вызывает onPress без самостоятельного изменения checked при checked=%s',
    async (checked) => {
      const onPress = jest.fn()
      const screen = render(
        <RadioButton
          checked={checked}
          label='Доставка курьером'
          onPress={onPress}
        />
      )

      await userEvent.press(
        screen.getByRole('radio', { name: 'Доставка курьером' })
      )

      expect(onPress).toHaveBeenCalledOnce()
      expect(screen.getByRole('radio', { checked })).toBeOnTheScreen()

      screen.rerender(
        <RadioButton checked={!checked} label='Доставка курьером' />
      )

      expect(screen.getByRole('radio', { checked: !checked })).toBeOnTheScreen()
    }
  )

  test.each([false, true])(
    'не вызывает обработчики при disabled и danger=%s',
    async (danger) => {
      const onPress = jest.fn()
      const onPressIn = jest.fn()
      const onPressOut = jest.fn()
      const screen = render(
        <RadioButton
          disabled
          danger={danger}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        />
      )

      await userEvent.press(screen.getByRole('radio'))

      for (const callback of [onPress, onPressIn, onPressOut]) {
        expect(callback).not.toHaveBeenCalled()
      }
    }
  )

  test('вызывает прежний onPress при использовании существующих props', async () => {
    const props: RadioButtonProps = { onPress: jest.fn() }
    const screen = render(<RadioButton {...props} />)

    await userEvent.press(
      screen.getByRole('radio', { checked: false, disabled: false })
    )

    expect(props.onPress).toHaveBeenCalledOnce()
    expect(screen.getByTestId('RadioButton_Pressable')).toBeOnTheScreen()
  })

  test.each([
    'press',
    'pressIn',
    'pressOut',
    'focus',
    'blur',
    'hoverIn',
    'hoverOut',
  ] as const)(
    'передаёт исходное событие пользовательскому обработчику при %s',
    (name) => {
      const callback = jest.fn()
      const props = { [`on${name[0].toUpperCase()}${name.slice(1)}`]: callback }
      const screen = render(<RadioButton danger {...props} />)
      const event = { nativeEvent: { timestamp: 42 } }

      fireEvent(screen.getByRole('radio'), name, event)

      expect(callback).toHaveBeenCalledExactlyOnceWith(event)
    }
  )

  test('передаёт pressed в callback style при нажатии и отпускании', async () => {
    const style = jest.fn(() => ({ opacity: 0.5 }))
    const screen = render(<RadioButton style={style} />)

    await userEvent.press(screen.getByRole('radio'))

    expect(style).toHaveBeenCalledWith(
      expect.objectContaining({ pressed: true })
    )
    expect(style).toHaveBeenLastCalledWith(
      expect.objectContaining({ pressed: false })
    )
  })

  test('показывает label и caption при передаче текста', () => {
    const screen = render(
      <RadioButton caption='Привезём заказ' label='Доставка курьером' />
    )

    expect(screen.getByRole('radio')).toHaveTextContent(
      'Доставка курьеромПривезём заказ'
    )
  })

  test('скрывает caption при удалении label', () => {
    const screen = render(
      <RadioButton caption='Привезём заказ' label='Доставка курьером' />
    )

    screen.rerender(<RadioButton caption='Привезём заказ' />)

    expect(screen.getByRole('radio')).toHaveTextContent('')
  })

  test('передаёт нативные props при их указании', () => {
    const screen = render(
      <RadioButton nativeID='DeliveryMethod' testID='DeliveryRadio' />
    )

    expect(screen.getByTestId('DeliveryRadio')).toHaveProp(
      'nativeID',
      'DeliveryMethod'
    )
  })

  test.each([
    { name: 'по умолчанию', hitSlop: undefined, expected: 10 },
    { name: 'без расширения', hitSlop: 0, expected: 0 },
    {
      name: 'с разными отступами',
      hitSlop: { top: 4, bottom: 8, left: 12, right: 16 },
      expected: { top: 4, bottom: 8, left: 12, right: 16 },
    },
  ])('задаёт область нажатия $name', ({ hitSlop, expected }) => {
    const screen = render(<RadioButton hitSlop={hitSlop} />)

    expect(screen.getByRole('radio')).toHaveProp('hitSlop', expected)
  })
})
