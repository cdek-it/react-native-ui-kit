import { render } from '@testing-library/react-native'

import { Checkbox } from '..'

describe('Checkbox — доступность', () => {
  test('представляет строку одним доступным чекбоксом при label, caption и иконке', () => {
    const screen = render(
      <Checkbox checked caption='Сообщать о доставке' label='Уведомления' />
    )

    expect(screen.getAllByRole('checkbox')).toHaveLength(1)
    expect(
      screen.getByRole('checkbox', { name: 'Уведомления' })
    ).toBeOnTheScreen()
    expect(screen.getByHintText('Сообщать о доставке')).toBeOnTheScreen()
    expect(screen.queryByText('Уведомления')).toBeNull()
    expect(screen.queryByText('Сообщать о доставке')).toBeNull()
    expect(screen.queryByTestId('SvgUniversalComponent')).toBeNull()
    expect(
      screen.getAllByTestId('SvgUniversalComponent', {
        includeHiddenElements: true,
      })
    ).not.toHaveLength(0)
  })

  test('возвращает состояние checked при снятии indeterminate', () => {
    const screen = render(<Checkbox checked indeterminate />)

    screen.rerender(<Checkbox checked indeterminate={false} />)

    expect(screen.getByRole('checkbox', { checked: true })).toBeOnTheScreen()
  })

  test('сохраняет busy и применяет состояния из props при противоречивом accessibilityState', () => {
    const screen = render(
      <Checkbox
        disabled
        indeterminate
        accessibilityState={{ busy: true, checked: false, disabled: false }}
      />
    )

    expect(
      screen.getByRole('checkbox', {
        checked: 'mixed',
        busy: true,
        disabled: true,
      })
    ).toBeOnTheScreen()
  })

  test('использует явное имя и подсказку при передаче нативных accessibility props', () => {
    const screen = render(
      <Checkbox
        accessibilityHint='Дополнительная информация'
        accessibilityLabel='Настройки уведомлений'
        caption='Подпись'
        label='Уведомления'
      />
    )

    expect(
      screen.getByRole('checkbox', { name: 'Настройки уведомлений' })
    ).toBeOnTheScreen()
    expect(screen.getByHintText('Дополнительная информация')).toBeOnTheScreen()
  })

  test('использует явное доступное имя при отсутствии label', () => {
    const screen = render(<Checkbox accessibilityLabel='Уведомления' />)

    expect(
      screen.getByRole('checkbox', { name: 'Уведомления' })
    ).toBeOnTheScreen()
  })

  test('передаёт связь с внешним текстом без автоматического имени при accessibilityLabelledBy', () => {
    const screen = render(
      <Checkbox
        accessibilityLabelledBy='NotificationsLabel'
        label='Уведомления'
      />
    )
    const control = screen.getByRole('checkbox')

    expect(control).toHaveProp('accessibilityLabelledBy', 'NotificationsLabel')
    expect(control.props.accessibilityLabel).toBeUndefined()
  })

  test.each([
    { name: 'label', props: { caption: 'Подпись' } },
    { name: 'caption', props: { label: 'Уведомления' } },
  ])('не задаёт подсказку из caption при отсутствии $name', ({ props }) => {
    const screen = render(<Checkbox {...props} />)

    expect(screen.getByRole('checkbox').props.accessibilityHint).toBeUndefined()
  })
})
