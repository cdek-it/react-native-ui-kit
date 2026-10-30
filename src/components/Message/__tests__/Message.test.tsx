import { render, screen, userEvent } from '@testing-library/react-native'
import { Text, View } from 'react-native'

import { Message } from '../Message'
import { TestId } from '../testIds'

const CustomIcon = () => <View testID='CustomIcon' />

describe('Message', () => {
  test('показывает заголовок без ограничения строк и необязательную подпись', () => {
    render(
      <Message caption='Подробности' title='Длинный заголовок сообщения' />
    )

    expect(screen.getByText('Длинный заголовок сообщения')).not.toHaveProp(
      'numberOfLines'
    )
    expect(screen.getByText('Подробности')).toBeOnTheScreen()
  })

  test.each([
    { name: 'без severity', severity: undefined },
    { name: 'info', severity: 'info' as const },
    { name: 'success', severity: 'success' as const },
    { name: 'warning', severity: 'warning' as const },
    { name: 'danger', severity: 'danger' as const },
  ])('показывает штатную иконку для $name', ({ severity }) => {
    render(<Message severity={severity} title='Сообщение' />)

    expect(
      screen.getByTestId(TestId.Icon, { includeHiddenElements: true })
    ).toBeOnTheScreen()
  })

  test('показывает пользовательскую иконку и скрывает её через hiddenIcon', () => {
    const { rerender } = render(<Message Icon={CustomIcon} title='Сообщение' />)

    expect(
      screen.getByTestId('CustomIcon', { includeHiddenElements: true })
    ).toBeOnTheScreen()

    rerender(<Message hiddenIcon Icon={CustomIcon} title='Сообщение' />)

    expect(
      screen.queryByTestId('CustomIcon', { includeHiddenElements: true })
    ).toBeNull()
    expect(
      screen.queryByTestId(TestId.Icon, { includeHiddenElements: true })
    ).toBeNull()
  })

  test.each([
    { name: 'только body', body: <Text>Содержимое</Text>, footer: undefined },
    { name: 'только footer', body: undefined, footer: <Text>Действия</Text> },
    {
      name: 'обе ноды',
      body: <Text>Содержимое</Text>,
      footer: <Text>Действия</Text>,
    },
  ])('отображает независимое содержимое: $name', ({ body, footer }) => {
    render(<Message body={body} footer={footer} title='Сообщение' />)

    expect(!!screen.queryByText('Содержимое')).toBe(!!body)
    expect(!!screen.queryByText('Действия')).toBe(!!footer)
  })

  test('не создаёт секцию body для отсутствующих нод', () => {
    render(<Message body={[]} footer={false} title='Сообщение' />)

    expect(screen.queryByTestId(TestId.Body)).toBeNull()
    expect(screen.queryByTestId(TestId.Caption)).toBeNull()
  })

  test('сохраняет пользовательский testID корня', () => {
    render(<Message testID='CustomMessage' title='Сообщение' />)

    expect(screen.getByTestId('CustomMessage')).toBeOnTheScreen()
  })

  test('не показывает закрытие без onClose даже при наличии closeLabel', () => {
    render(<Message closeLabel='Понятно' title='Сообщение' />)

    expect(screen.queryByRole('button')).toBeNull()
  })

  test.each([
    { name: 'крестиком', closeLabel: undefined, buttonName: 'Закрыть' },
    { name: 'текстом', closeLabel: 'Понятно', buttonName: 'Понятно' },
  ])(
    'вызывает onClose без native event при закрытии $name',
    async ({ closeLabel, buttonName }) => {
      const onClose = jest.fn()
      const user = userEvent.setup()
      render(
        <Message closeLabel={closeLabel} title='Сообщение' onClose={onClose} />
      )
      await user.press(screen.getByRole('button', { name: buttonName }))

      expect(onClose).toHaveBeenCalledExactlyOnceWith()
      expect(screen.getByText('Сообщение')).toBeOnTheScreen()
    }
  )
})
