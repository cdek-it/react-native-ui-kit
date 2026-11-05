import { render } from '@testing-library/react-native'

import { ToggleSwitch } from '..'

describe('ToggleSwitch — доступность', () => {
  test('представляет строку одним доступным переключателем при наличии label и caption', () => {
    const screen = render(
      <ToggleSwitch
        caption='Сообщать о доставке'
        checked={false}
        label='Уведомления'
      />
    )

    expect(screen.getAllByRole('switch')).toHaveLength(1)
    expect(
      screen.getByRole('switch', { name: 'Уведомления' })
    ).toBeOnTheScreen()
    expect(screen.getByHintText('Сообщать о доставке')).toBeOnTheScreen()
  })

  test.each([
    { name: 'caption', props: { label: 'Уведомления' } },
    { name: 'label', props: { caption: 'Подпись' } },
  ])('не задаёт подсказку при отсутствии $name', ({ props }) => {
    const screen = render(<ToggleSwitch checked={false} {...props} />)

    expect(screen.getByRole('switch').props.accessibilityHint).toBeUndefined()
  })

  test('сохраняет busy и использует checked и disabled из props при передаче accessibilityState', () => {
    const screen = render(
      <ToggleSwitch
        checked
        disabled
        accessibilityLabel='Уведомления'
        accessibilityState={{ busy: true, checked: false, disabled: false }}
      />
    )

    expect(
      screen.getByRole('switch', {
        name: 'Уведомления',
        checked: true,
        busy: true,
      })
    ).toBeDisabled()
  })

  test('переопределяет доступное имя и подсказку при передаче accessibilityLabel и accessibilityHint', () => {
    const screen = render(
      <ToggleSwitch
        accessibilityHint='Изменить настройку'
        accessibilityLabel='Уведомления о доставке'
        caption='Подпись'
        checked={false}
        label='Уведомления'
        testID='NotificationSwitch'
      />
    )

    expect(screen.getByRole('switch', { name: 'Уведомления о доставке' })).toBe(
      screen.getByTestId('NotificationSwitch')
    )
    expect(screen.getByHintText('Изменить настройку')).toBeOnTheScreen()
    expect(screen.queryByHintText('Подпись')).not.toBeOnTheScreen()
  })

  test('связывает переключатель с внешним текстом при передаче accessibilityLabelledBy', () => {
    const screen = render(
      <ToggleSwitch
        accessibilityLabelledBy='NotificationLabel'
        checked={false}
      />
    )

    expect(screen.getByRole('switch')).toHaveProp(
      'accessibilityLabelledBy',
      'NotificationLabel'
    )
    expect(screen.queryByText('Уведомления')).not.toBeOnTheScreen()
  })

  test('сохраняет роль switch при отсутствии label и доступного имени', () => {
    const screen = render(<ToggleSwitch checked={false} />)

    expect(screen.getByRole('switch')).toBeOnTheScreen()
  })
})
