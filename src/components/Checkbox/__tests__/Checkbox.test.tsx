import { fireEvent, render, userEvent } from '@testing-library/react-native'

import { Checkbox, type CheckboxProps } from '..'

describe('Checkbox', () => {
  test.each([
    { name: 'unchecked', checked: false, indeterminate: false, next: true },
    { name: 'checked', checked: true, indeterminate: false, next: false },
    {
      name: 'mixed с checked=false',
      checked: false,
      indeterminate: true,
      next: true,
    },
    {
      name: 'mixed с checked=true',
      checked: true,
      indeterminate: true,
      next: false,
    },
  ])(
    'сообщает следующее значение без самостоятельного изменения при $name',
    async ({ checked, indeterminate, next }) => {
      const onCheckedChange = jest.fn()
      const screen = render(
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          label='Уведомления'
          onCheckedChange={onCheckedChange}
        />
      )

      await userEvent.press(
        screen.getByRole('checkbox', { name: 'Уведомления' })
      )

      expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(next)
      expect(
        screen.getByRole('checkbox', {
          checked: indeterminate ? 'mixed' : checked,
        })
      ).toBeOnTheScreen()

      screen.rerender(
        <Checkbox
          checked={next}
          indeterminate={indeterminate}
          label='Уведомления'
        />
      )

      expect(
        screen.getByRole('checkbox', {
          checked: indeterminate ? 'mixed' : next,
        })
      ).toBeOnTheScreen()
    }
  )

  test.each([false, true])(
    'не вызывает обработчики при disabled и danger=%s',
    async (danger) => {
      const onCheckedChange = jest.fn()
      const onPress = jest.fn()
      const onPressIn = jest.fn()
      const onPressOut = jest.fn()
      const screen = render(
        <Checkbox
          disabled
          danger={danger}
          onCheckedChange={onCheckedChange}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        />
      )

      await userEvent.press(screen.getByRole('checkbox'))

      for (const callback of [
        onCheckedChange,
        onPress,
        onPressIn,
        onPressOut,
      ]) {
        expect(callback).not.toHaveBeenCalled()
      }
    }
  )

  test('вызывает прежний onPress при использовании существующих props', async () => {
    const props: CheckboxProps = { onPress: jest.fn() }
    const screen = render(<Checkbox {...props} />)

    await userEvent.press(
      screen.getByRole('checkbox', { checked: false, disabled: false })
    )

    expect(props.onPress).toHaveBeenCalledOnce()
    expect(screen.getByTestId('CheckboxButton_Pressable')).toBeOnTheScreen()
  })

  test('передаёт исходное событие в onPress после callback значения при нативном нажатии', () => {
    const onCheckedChange = jest.fn()
    const onPress = jest.fn()
    const screen = render(
      <Checkbox danger onCheckedChange={onCheckedChange} onPress={onPress} />
    )

    const event = { nativeEvent: { timestamp: 42 } }

    fireEvent.press(screen.getByRole('checkbox'), event)

    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true)
    expect(onPress).toHaveBeenCalledExactlyOnceWith(event)
    expect(onCheckedChange).toHaveBeenCalledBefore(onPress)
  })

  test('передаёт pressed в callback style при нажатии и отпускании', async () => {
    const style = jest.fn(() => ({ opacity: 0.5 }))
    const screen = render(<Checkbox style={style} />)

    await userEvent.press(screen.getByRole('checkbox'))

    expect(style).toHaveBeenCalledWith(
      expect.objectContaining({ pressed: true })
    )
    expect(style).toHaveBeenLastCalledWith(
      expect.objectContaining({ pressed: false })
    )
  })

  test('показывает label и caption при передаче текста', () => {
    const screen = render(
      <Checkbox caption='Сообщать о доставке' label='Уведомления' />
    )

    expect(screen.getByRole('checkbox')).toHaveTextContent(
      'УведомленияСообщать о доставке'
    )
  })

  test('скрывает caption при удалении label', () => {
    const screen = render(<Checkbox caption='Подпись' label='Уведомления' />)

    screen.rerender(<Checkbox caption='Подпись' />)

    expect(screen.getByRole('checkbox')).toHaveTextContent('')
  })

  test.each([
    'focus',
    'blur',
    'hoverIn',
    'hoverOut',
    'pressIn',
    'pressOut',
  ] as const)(
    'передаёт исходное событие пользовательскому обработчику при %s',
    (name) => {
      const callback = jest.fn()
      const props = { [`on${name[0].toUpperCase()}${name.slice(1)}`]: callback }
      const screen = render(<Checkbox {...props} />)
      const event = { nativeEvent: { timestamp: 42 } }

      fireEvent(screen.getByRole('checkbox'), name, event)

      expect(callback).toHaveBeenCalledExactlyOnceWith(event)
    }
  )

  test('передаёт нативные props при их указании', () => {
    const screen = render(
      <Checkbox nativeID='Notifications' testID='NotificationCheckbox' />
    )

    expect(screen.getByTestId('NotificationCheckbox')).toHaveProp(
      'nativeID',
      'Notifications'
    )
  })
})
