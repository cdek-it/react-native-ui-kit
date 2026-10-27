import { fireEvent, render, userEvent } from '@testing-library/react-native'
import { Pressable, Text } from 'react-native'
import Svg from 'react-native-svg'

import { Message, ToastMessage } from '..'

const CustomIcon = () => <Svg testID='CustomMessageIcon' />

describe.each([
  { name: 'Message', Component: Message },
  { name: 'ToastMessage', Component: ToastMessage },
])('$name', ({ name, Component }) => {
  test.each(['info', 'success', 'warning', 'danger'] as const)(
    'отображает содержимое при severity=%s',
    (severity) => {
      const screen = render(
        <Component
          body={<Text>Содержимое</Text>}
          caption='Подпись'
          footer={<Text>Футер</Text>}
          severity={severity}
          title='Заголовок'
        />
      )

      for (const text of ['Заголовок', 'Подпись', 'Содержимое', 'Футер'])
        expect(screen.getByText(text)).toBeOnTheScreen()
    }
  )

  test.each([
    { body: true, footer: false },
    { body: false, footer: true },
    { body: true, footer: true },
  ])(
    'показывает независимые body=$body и footer=$footer без caption',
    ({ body, footer }) => {
      const screen = render(
        <Component
          body={body ? <Text>Тело</Text> : undefined}
          footer={footer ? <Text>Действие</Text> : undefined}
          title='Заголовок'
        />
      )

      expect(Boolean(screen.queryByText('Тело'))).toBe(body)
      expect(Boolean(screen.queryByText('Действие'))).toBe(footer)
    }
  )

  test('добавляет и удаляет ноды после обновления props', () => {
    const screen = render(<Component title='Заголовок' />)
    screen.rerender(
      <Component
        body={<Text>Тело</Text>}
        footer={<Text>Футер</Text>}
        title='Заголовок'
      />
    )

    expect(screen.getByText('Тело')).toBeOnTheScreen()
    expect(screen.getByText('Футер')).toBeOnTheScreen()

    screen.rerender(<Component title='Заголовок' />)

    expect(screen.queryByText('Тело')).toBeNull()
    expect(screen.queryByText('Футер')).toBeNull()
  })

  test('поддерживает пользовательскую иконку и hiddenIcon', () => {
    const screen = render(<Component Icon={CustomIcon} title='Заголовок' />)

    expect(
      screen.getByTestId('CustomMessageIcon', { includeHiddenElements: true })
    ).toBeOnTheScreen()

    screen.rerender(
      <Component hiddenIcon Icon={CustomIcon} title='Заголовок' />
    )

    expect(
      screen.queryByTestId('CustomMessageIcon', { includeHiddenElements: true })
    ).toBeNull()
    expect(
      screen.queryByTestId(`${name}Icon`, { includeHiddenElements: true })
    ).toBeNull()
  })

  test('не показывает закрытие без onClose даже при наличии closeLabel', () => {
    const screen = render(<Component closeLabel='Отменить' title='Заголовок' />)

    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.queryByText('Отменить')).toBeNull()
  })

  test.each([undefined, 'Отменить'])(
    'вызывает onClose без аргументов и сохраняет сообщение при closeLabel=%s',
    async (closeLabel) => {
      const onClose = jest.fn()
      const screen = render(
        <Component
          closeLabel={closeLabel}
          title='Заголовок'
          onClose={onClose}
        />
      )
      await userEvent
        .setup()
        .press(screen.getByRole('button', { name: closeLabel ?? 'Закрыть' }))

      expect(onClose).toHaveBeenCalledOnce()
      expect(onClose).toHaveBeenCalledWith()
      expect(screen.getByText('Заголовок')).toBeOnTheScreen()
    }
  )

  test('сохраняет интерактивность body и footer', () => {
    const bodyAction = jest.fn()
    const footerAction = jest.fn()
    const screen = render(
      <Component
        body={
          <Pressable accessibilityRole='button' onPress={bodyAction}>
            <Text>Подробнее</Text>
          </Pressable>
        }
        footer={
          <Pressable accessibilityRole='button' onPress={footerAction}>
            <Text>Повторить</Text>
          </Pressable>
        }
        title='Заголовок'
      />
    )
    fireEvent.press(screen.getByRole('button', { name: 'Подробнее' }))
    fireEvent.press(screen.getByRole('button', { name: 'Повторить' }))

    expect(bodyAction).toHaveBeenCalledOnce()
    expect(footerAction).toHaveBeenCalledOnce()
  })

  test('передаёт пользовательский testID контейнеру', () => {
    const screen = render(
      <Component testID='CustomMessage' title='Заголовок' />
    )

    expect(screen.getByTestId('CustomMessage')).toBeOnTheScreen()
  })
})

describe('Message — структура', () => {
  test('ограничивает заголовок двумя строками с многоточием', () => {
    const screen = render(<Message title='Длинный заголовок' />)

    expect(screen.getByText('Длинный заголовок')).toHaveProp('numberOfLines', 2)
    expect(screen.getByText('Длинный заголовок')).toHaveProp(
      'ellipsizeMode',
      'tail'
    )
  })

  test.each([undefined, null, false, []])(
    'не показывает пустую нижнюю секцию при условных нодах %p',
    (node) => {
      const screen = render(
        <Message body={node} footer={node} title='Заголовок' />
      )

      expect(screen.queryByTestId('MessageContent')).toBeNull()
    }
  )
})
