import { render } from '@testing-library/react-native'
import { Pressable, Text } from 'react-native'

import { Message } from '..'

describe('Message — доступность', () => {
  test('использует имя «Закрыть» для крестика без обязательной подписи', () => {
    const screen = render(<Message title='Сообщение' onClose={jest.fn()} />)

    expect(screen.getByRole('button', { name: 'Закрыть' })).toBeOnTheScreen()
  })

  test('переопределяет имя крестика через closeAccessibilityLabel', () => {
    const screen = render(
      <Message
        closeAccessibilityLabel='Dismiss notification'
        title='Сообщение'
        onClose={jest.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: 'Dismiss notification' })
    ).toBeOnTheScreen()
  })

  test('использует видимый closeLabel как имя текстовой кнопки', () => {
    const screen = render(
      <Message
        closeAccessibilityLabel='Закрыть уведомление'
        closeLabel='Отменить'
        title='Сообщение'
        onClose={jest.fn()}
      />
    )

    expect(screen.getByRole('button', { name: 'Отменить' })).toBeOnTheScreen()
    expect(
      screen.queryByRole('button', { name: 'Закрыть уведомление' })
    ).toBeNull()
  })

  test('сохраняет отдельные действия и не объединяет содержимое корнем', () => {
    const screen = render(
      <Message
        body={
          <Pressable accessibilityRole='button'>
            <Text>Подробнее</Text>
          </Pressable>
        }
        caption='Подпись'
        footer={
          <Pressable accessibilityRole='button'>
            <Text>Повторить</Text>
          </Pressable>
        }
        title='Заголовок'
        onClose={jest.fn()}
      />
    )

    expect(screen.getByTestId('MessageContainer')).not.toHaveProp(
      'accessible',
      true
    )
    expect(screen.getByRole('button', { name: 'Подробнее' })).toBeOnTheScreen()
    expect(screen.getByRole('button', { name: 'Повторить' })).toBeOnTheScreen()
    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(screen.getByText('Заголовок')).toBeOnTheScreen()
    expect(screen.getByText('Подпись')).toBeOnTheScreen()
  })

  test('скрывает декоративную иконку от отдельного озвучивания', () => {
    const screen = render(<Message title='Сообщение' />)
    const icon = screen.getByTestId('MessageIcon', {
      includeHiddenElements: true,
    })

    expect(icon).toHaveProp('accessibilityElementsHidden', true)
    expect(icon).toHaveProp('importantForAccessibility', 'no-hide-descendants')
  })

  test('сохраняет переданные accessibility props контейнера', () => {
    const screen = render(
      <Message
        accessibilityHint='Проверьте данные'
        accessibilityLanguage='ru-RU'
        title='Сообщение'
      />
    )

    expect(screen.getByTestId('MessageContainer')).toHaveProp(
      'accessibilityHint',
      'Проверьте данные'
    )
    expect(screen.getByTestId('MessageContainer')).toHaveProp(
      'accessibilityLanguage',
      'ru-RU'
    )
  })
})
