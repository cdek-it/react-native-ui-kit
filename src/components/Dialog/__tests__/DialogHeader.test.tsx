import { render, screen, userEvent } from '@testing-library/react-native'

import { DialogHeader } from '../DialogHeader'

describe('DialogHeader', () => {
  test('показывает заголовок без кнопки закрытия', () => {
    render(<DialogHeader title='Детали заказа' />)

    expect(screen.getByText('Детали заказа')).toBeOnTheScreen()
    expect(screen.queryByRole('button')).not.toBeOnTheScreen()
  })

  test('вызывает onClose без native event', async () => {
    const onClose = jest.fn()
    const user = userEvent.setup()
    render(<DialogHeader title='Детали заказа' onClose={onClose} />)
    await user.press(screen.getByRole('button', { name: 'Закрыть диалог' }))

    expect(onClose).toHaveBeenCalledExactlyOnceWith()
  })
})
