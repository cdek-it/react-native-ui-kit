import { render, screen, userEvent } from '@testing-library/react-native'
import { Pressable, Text } from 'react-native'

import { Message } from '../Message'
import { TestId } from '../testIds'

describe('Message: доступность', () => {
  test('не объединяет содержимое корня в один доступный элемент', () => {
    render(<Message title='Сообщение' />)

    expect(screen.getByTestId(TestId.Container)).not.toHaveProp(
      'accessible',
      true
    )
  })

  test('использует переданное имя крестика', () => {
    render(
      <Message
        closeAccessibilityLabel='Скрыть предупреждение'
        title='Сообщение'
        onClose={jest.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: 'Скрыть предупреждение' })
    ).toBeOnTheScreen()
  })

  test('берёт имя текстовой кнопки из видимого текста', () => {
    render(
      <Message
        closeAccessibilityLabel='Скрыть предупреждение'
        closeLabel='Понятно'
        title='Сообщение'
        onClose={jest.fn()}
      />
    )

    expect(screen.getByRole('button', { name: 'Понятно' })).toBeOnTheScreen()
  })

  test('передаёт accessibility props потребителя корню', () => {
    render(
      <Message
        accessibilityHint='Подробности доставки'
        accessibilityLabel='Статус заказа'
        accessibilityLiveRegion='polite'
        title='Сообщение'
      />
    )

    expect(screen.getByTestId(TestId.Container)).toHaveProp(
      'accessibilityLabel',
      'Статус заказа'
    )
    expect(screen.getByTestId(TestId.Container)).toHaveProp(
      'accessibilityHint',
      'Подробности доставки'
    )
    expect(screen.getByTestId(TestId.Container)).toHaveProp(
      'accessibilityLiveRegion',
      'polite'
    )
  })

  test('скрывает декоративную иконку из дерева доступности', () => {
    render(<Message title='Сообщение' />)

    expect(screen.queryByTestId(TestId.Icon)).toBeNull()
    expect(
      screen.getByTestId(TestId.Icon, { includeHiddenElements: true })
    ).toBeOnTheScreen()
  })

  test('сохраняет отдельные доступные действия в body и footer', async () => {
    const onBodyPress = jest.fn()
    const onFooterPress = jest.fn()
    const user = userEvent.setup()
    render(
      <Message
        body={
          <Pressable accessibilityRole='button' onPress={onBodyPress}>
            <Text>Подробнее</Text>
          </Pressable>
        }
        footer={
          <Pressable accessibilityRole='button' onPress={onFooterPress}>
            <Text>Повторить</Text>
          </Pressable>
        }
        title='Сообщение'
        onClose={jest.fn()}
      />
    )

    expect(screen.getAllByRole('button')).toHaveLength(3)

    await user.press(screen.getByRole('button', { name: 'Подробнее' }))
    await user.press(screen.getByRole('button', { name: 'Повторить' }))

    expect(onBodyPress).toHaveBeenCalledOnce()
    expect(onFooterPress).toHaveBeenCalledOnce()
  })
})
