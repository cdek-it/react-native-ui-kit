import { render } from '@testing-library/react-native'
import { Pressable, Text } from 'react-native'

import { Message, ToastMessage } from '..'

describe.each([
  { name: 'Message', Component: Message },
  { name: 'ToastMessage', Component: ToastMessage },
])('$name — доступность', ({ name, Component }) => {
  test('использует имя «Закрыть» для крестика без обязательной подписи', () => {
    const screen = render(<Component title='Сообщение' onClose={jest.fn()} />)

    expect(screen.getByRole('button', { name: 'Закрыть' })).toBeOnTheScreen()
  })

  test('переопределяет имя крестика через closeAccessibilityLabel', () => {
    const screen = render(
      <Component
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
      <Component
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
      <Component
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

    expect(screen.getByTestId(`${name}Container`)).not.toHaveProp(
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
    const screen = render(<Component title='Сообщение' />)
    const icon = screen.getByTestId(`${name}Icon`, {
      includeHiddenElements: true,
    })

    expect(icon).toHaveProp('accessibilityElementsHidden', true)
    expect(icon).toHaveProp('importantForAccessibility', 'no-hide-descendants')
  })

  test('сохраняет переданные accessibility props контейнера', () => {
    const screen = render(
      <Component
        accessibilityHint='Проверьте данные'
        accessibilityLanguage='ru-RU'
        title='Сообщение'
      />
    )

    expect(screen.getByTestId(`${name}Container`)).toHaveProp(
      'accessibilityHint',
      'Проверьте данные'
    )
    expect(screen.getByTestId(`${name}Container`)).toHaveProp(
      'accessibilityLanguage',
      'ru-RU'
    )
  })
})
