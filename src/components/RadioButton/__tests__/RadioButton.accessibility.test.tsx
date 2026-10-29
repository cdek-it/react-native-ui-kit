import { render } from '@testing-library/react-native'

import { RadioButton } from '..'

describe('RadioButton — доступность', () => {
  test('представляет строку одним доступным radio при label и caption', () => {
    const screen = render(
      <RadioButton checked caption='Привезём заказ' label='Доставка курьером' />
    )

    expect(screen.getAllByRole('radio')).toHaveLength(1)
    expect(
      screen.getByRole('radio', { name: 'Доставка курьером' })
    ).toBeOnTheScreen()
    expect(screen.getByHintText('Привезём заказ')).toBeOnTheScreen()
    expect(screen.queryByText('Доставка курьером')).toBeNull()
    expect(screen.queryByText('Привезём заказ')).toBeNull()
  })

  test('сохраняет busy и применяет состояния из props при противоречивом accessibilityState', () => {
    const screen = render(
      <RadioButton
        checked
        disabled
        accessibilityState={{ busy: true, checked: false, disabled: false }}
      />
    )

    expect(
      screen.getByRole('radio', { checked: true, disabled: true, busy: true })
    ).toBeOnTheScreen()
  })

  test('использует явное имя и подсказку при передаче нативных accessibility props', () => {
    const screen = render(
      <RadioButton
        accessibilityHint='Дополнительная информация'
        accessibilityLabel='Выбрать доставку курьером'
        caption='Привезём заказ'
        label='Доставка курьером'
      />
    )

    expect(
      screen.getByRole('radio', { name: 'Выбрать доставку курьером' })
    ).toBeOnTheScreen()
    expect(screen.getByHintText('Дополнительная информация')).toBeOnTheScreen()
  })

  test('использует явное доступное имя при отсутствии label', () => {
    const screen = render(
      <RadioButton accessibilityLabel='Доставка курьером' />
    )

    expect(
      screen.getByRole('radio', { name: 'Доставка курьером' })
    ).toBeOnTheScreen()
  })

  test('передаёт связь с внешним текстом без автоматического имени при accessibilityLabelledBy', () => {
    const screen = render(
      <RadioButton
        accessibilityLabelledBy='DeliveryMethodLabel'
        label='Доставка курьером'
      />
    )
    const control = screen.getByRole('radio')

    expect(control).toHaveProp('accessibilityLabelledBy', 'DeliveryMethodLabel')
    expect(control.props.accessibilityLabel).toBeUndefined()
  })

  test.each([
    { name: 'label', props: { caption: 'Подпись' } },
    { name: 'caption', props: { label: 'Доставка курьером' } },
  ])('не задаёт подсказку из caption при отсутствии $name', ({ props }) => {
    const screen = render(<RadioButton {...props} />)

    expect(screen.getByRole('radio').props.accessibilityHint).toBeUndefined()
  })
})
