import { render, screen } from '@testing-library/react-native'

import { DialogHeader } from '../DialogHeader'

describe('DialogHeader accessibility', () => {
  test.each(['danger', 'warning', 'info', 'success', 'help'] as const)(
    'severity=%s не создаёт отдельного доступного элемента',
    (severity) => {
      render(
        <DialogHeader severity={severity} title='Полный заголовок заказа' />
      )

      expect(screen.getAllByRole('header')).toHaveLength(1)
      expect(
        screen.getByRole('header', { name: 'Полный заголовок заказа' })
      ).toBeOnTheScreen()
      expect(screen.queryByRole('image')).not.toBeOnTheScreen()
    }
  )

  test('использует заданное имя кнопки закрытия', () => {
    render(
      <DialogHeader
        closeAccessibilityLabel='Закрыть редактирование заказа'
        title='Заказ'
        onClose={jest.fn()}
      />
    )

    expect(
      screen.getByRole('button', { name: 'Закрыть редактирование заказа' })
    ).toBeOnTheScreen()
  })
})
