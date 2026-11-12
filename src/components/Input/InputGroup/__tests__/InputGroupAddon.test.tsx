import { IconUser } from '@tabler/icons-react-native'
import { render, userEvent } from '@testing-library/react-native'
import { Text } from 'react-native'

import { InputGroupAddon } from '../InputGroupAddon'

describe('InputGroupAddon', () => {
  test('вычисляет доступный disabled из своего disabled, сохраняя остальные состояния', () => {
    const onPress = jest.fn()
    const { getByRole } = render(
      <InputGroupAddon
        {...{ 'aria-disabled': false }}
        disabled
        accessibilityState={{ busy: true }}
        onPress={onPress}
      >
        Найти
      </InputGroupAddon>
    )

    expect(getByRole('button', { name: 'Найти' })).toHaveProp(
      'accessibilityState',
      { disabled: true, busy: true }
    )
  })

  test.each([
    { name: 'строки', children: 'Найти' },
    { name: 'числа', children: 42 },
    { name: 'нуля', children: 0 },
  ])('задаёт доступное имя из $name в children', ({ children }) => {
    const { getByRole, getByText } = render(
      <InputGroupAddon onPress={jest.fn()}>{children}</InputGroupAddon>
    )

    expect(getByRole('button', { name: String(children) })).toHaveProp(
      'accessibilityLabel',
      String(children)
    )
    expect(getByText(String(children))).toBeOnTheScreen()
  })

  test('сохраняет приоритет явно переданного доступного имени', () => {
    const { getByRole, getByText } = render(
      <InputGroupAddon accessibilityLabel='Найти заказ' onPress={jest.fn()}>
        Найти
      </InputGroupAddon>
    )

    expect(getByRole('button', { name: 'Найти заказ' })).toHaveProp(
      'accessibilityLabel',
      'Найти заказ'
    )
    expect(getByText('Найти')).toBeOnTheScreen()
  })

  test.each([
    { name: 'ноды', children: <Text>Открыть</Text> },
    { name: 'render-функции', children: () => <Text>Открыть</Text> },
  ])('сохраняет доступное имя из текста собственной $name', ({ children }) => {
    const { getByRole } = render(
      <InputGroupAddon onPress={jest.fn()}>{children}</InputGroupAddon>
    )

    expect(getByRole('button', { name: 'Открыть' })).toBeOnTheScreen()
  })

  test('отображает текст и SVG без действия по умолчанию', () => {
    const { getByText, queryByRole } = render(
      <InputGroupAddon Icon={IconUser}>Пользователь</InputGroupAddon>
    )

    expect(getByText('Пользователь')).toBeOnTheScreen()
    expect(queryByRole('button')).not.toBeOnTheScreen()
  })

  test('вызывает явно переданное действие', async () => {
    const onPress = jest.fn()
    const { getByRole } = render(
      <InputGroupAddon onPress={onPress}>Найти</InputGroupAddon>
    )
    await userEvent.press(getByRole('button', { name: 'Найти' }))

    expect(onPress).toHaveBeenCalledOnce()
  })

  test('не вызывает действие отключённой добавки', async () => {
    const onPress = jest.fn()
    const { getByRole } = render(
      <InputGroupAddon disabled onPress={onPress}>
        Найти
      </InputGroupAddon>
    )
    await userEvent.press(getByRole('button', { name: 'Найти' }))

    expect(onPress).not.toHaveBeenCalled()
  })

  test('сохраняет доступное имя и событие кнопки только с SVG', async () => {
    const onPress = jest.fn()
    const { getByRole } = render(
      <InputGroupAddon
        Icon={IconUser}
        accessibilityHint='Открывает список контактов'
        accessibilityLabel='Выбрать получателя'
        onPress={onPress}
      />
    )
    const button = getByRole('button', { name: 'Выбрать получателя' })

    expect(button).toHaveProp('accessibilityHint', 'Открывает список контактов')

    await userEvent.press(button)

    expect(onPress).toHaveBeenCalledOnce()
  })
})
