import { fireEvent, render, userEvent } from '@testing-library/react-native'

import { ToggleSwitch } from '..'

describe('ToggleSwitch', () => {
  test.each([
    { name: 'checked=false', checked: false, next: true },
    { name: 'checked=true', checked: true, next: false },
  ])(
    'сообщает следующее значение при нажатии, если $name',
    async ({ checked, next }) => {
      const onCheckedChange = jest.fn()
      const screen = render(
        <ToggleSwitch
          checked={checked}
          label='Уведомления'
          onCheckedChange={onCheckedChange}
        />
      )

      await userEvent.press(screen.getByRole('switch', { name: 'Уведомления' }))

      expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(next)
      expect(screen.getByRole('switch', { checked })).toBeOnTheScreen()

      screen.rerender(<ToggleSwitch checked={next} label='Уведомления' />)

      expect(screen.getByRole('switch', { checked: next })).toBeOnTheScreen()
    }
  )

  test.each([false, true])(
    'не вызывает обработчики при нажатии, если disabled=true и checked=%s',
    async (checked) => {
      const onCheckedChange = jest.fn()
      const onPress = jest.fn()
      const onPressIn = jest.fn()
      const onPressOut = jest.fn()
      const screen = render(
        <ToggleSwitch
          disabled
          checked={checked}
          label='Уведомления'
          onCheckedChange={onCheckedChange}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        />
      )
      const control = screen.getByRole('switch', { checked })

      await userEvent.press(control)

      expect(control).toBeDisabled()

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

  test('вызывает onCheckedChange и нативные обработчики с исходными событиями при нажатии', () => {
    const onCheckedChange = jest.fn()
    const onPress = jest.fn()
    const onPressIn = jest.fn()
    const onPressOut = jest.fn()
    const screen = render(
      <ToggleSwitch
        checked={false}
        label='Уведомления'
        onCheckedChange={onCheckedChange}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      />
    )
    const control = screen.getByRole('switch')
    const event = { nativeEvent: { timestamp: 42 } }

    fireEvent(control, 'pressIn', event)
    fireEvent.press(control, event)
    fireEvent(control, 'pressOut', event)

    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true)
    expect(onPress).toHaveBeenCalledExactlyOnceWith(event)
    expect(onPressIn).toHaveBeenCalledExactlyOnceWith(event)
    expect(onPressOut).toHaveBeenCalledExactlyOnceWith(event)
  })

  test('передаёт pressed в callback style при нажатии и отпускании', async () => {
    const style = jest.fn(() => ({ opacity: 0.5 }))
    const screen = render(
      <ToggleSwitch checked={false} label='Уведомления' style={style} />
    )

    await userEvent.press(screen.getByRole('switch'))

    expect(style).toHaveBeenCalledWith(
      expect.objectContaining({ pressed: true })
    )
    expect(style).toHaveBeenLastCalledWith(
      expect.objectContaining({ pressed: false })
    )
  })

  test('показывает подпись при добавлении caption к label', () => {
    const screen = render(<ToggleSwitch checked={false} label='Уведомления' />)
    const control = screen.getByRole('switch', { name: 'Уведомления' })

    expect(control).toHaveTextContent('Уведомления')

    screen.rerender(
      <ToggleSwitch
        caption='Сообщать о доставке'
        checked={false}
        label='Уведомления'
      />
    )

    expect(screen.getByRole('switch')).toHaveTextContent(
      'УведомленияСообщать о доставке'
    )
  })

  test('не показывает caption при отсутствии label', () => {
    const screen = render(<ToggleSwitch caption='Подпись' checked={false} />)
    const control = screen.getByRole('switch')

    expect(control).toHaveTextContent('')
  })

  test.each(['focus', 'blur', 'hoverIn', 'hoverOut'] as const)(
    'передаёт исходное событие пользовательскому обработчику при %s',
    (name) => {
      const callback = jest.fn()
      const props = { [`on${name[0].toUpperCase()}${name.slice(1)}`]: callback }
      const screen = render(
        <ToggleSwitch checked={false} label='Уведомления' {...props} />
      )
      const event = { nativeEvent: { target: 1 } }

      fireEvent(screen.getByRole('switch'), name, event)

      expect(callback).toHaveBeenCalledExactlyOnceWith(event)
    }
  )
})
