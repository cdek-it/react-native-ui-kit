import { fireEvent, render, screen } from '@testing-library/react-native'
import { AccessibilityInfo, Modal, Text, TextInput } from 'react-native'

import { Button } from '../../Button'
import { Dialog, DialogTestId } from '../Dialog'
import { DialogHeader } from '../DialogHeader'

describe('Dialog accessibility', () => {
  afterEach(() => jest.restoreAllMocks())

  test('получает имя из DialogHeader и не объединяет интерактивные элементы', () => {
    render(
      <Dialog visible header={<DialogHeader title='Детали заказа' />}>
        <TextInput accessibilityLabel='Комментарий' />
        <Button label='Сохранить' />
      </Dialog>
    )
    const content = screen.getByTestId(DialogTestId.contentContainer)

    expect(content).toHaveProp('role', 'dialog')
    expect(content).toHaveProp('accessibilityViewIsModal', true)
    expect(content).toHaveProp('accessible', false)
    expect(content).toHaveProp('accessibilityLabel', 'Детали заказа')
    expect(
      screen.getByRole('header', { name: 'Детали заказа' })
    ).toBeOnTheScreen()
    expect(screen.getByLabelText('Комментарий')).toBeOnTheScreen()
    expect(screen.getByRole('button', { name: 'Сохранить' })).toBeOnTheScreen()
    expect(
      screen.getByTestId(DialogTestId.backdrop, { includeHiddenElements: true })
    ).toHaveProp('accessible', false)
  })

  test('передаёт явные accessibility props в содержимое и обновляет имя шапки', () => {
    const { rerender } = render(
      <Dialog
        visible
        accessibilityHint='Проверьте данные'
        accessibilityLabel='Редактирование'
        header={<DialogHeader title='Заказ' />}
      />
    )

    expect(screen.getByTestId(DialogTestId.contentContainer)).toHaveProp(
      'accessibilityLabel',
      'Редактирование'
    )
    expect(screen.getByTestId(DialogTestId.contentContainer)).toHaveProp(
      'accessibilityHint',
      'Проверьте данные'
    )
    expect(
      screen.getByTestId(DialogTestId.backdrop, { includeHiddenElements: true })
    ).not.toHaveProp('accessibilityHint')

    rerender(<Dialog visible header={<DialogHeader title='Получатель' />} />)

    expect(screen.getByTestId(DialogTestId.contentContainer)).toHaveProp(
      'accessibilityLabel',
      'Получатель'
    )

    rerender(
      <Dialog visible accessibilityLabel='Без шапки'>
        <Text>Содержимое</Text>
      </Dialog>
    )

    expect(screen.getByTestId(DialogTestId.contentContainer)).toHaveProp(
      'accessibilityLabel',
      'Без шапки'
    )
  })

  test('escape вызывает onClose и пользовательский обработчик при запрете закрытия по фону', () => {
    const onClose = jest.fn()
    const onAccessibilityEscape = jest.fn()
    render(
      <Dialog
        visible
        closeOnBackdropPress={false}
        onAccessibilityEscape={onAccessibilityEscape}
        onClose={onClose}
      />
    )
    fireEvent(
      screen.getByTestId(DialogTestId.contentContainer),
      'accessibilityEscape'
    )

    expect(onClose).toHaveBeenCalledExactlyOnceWith()
    expect(onAccessibilityEscape).toHaveBeenCalledExactlyOnceWith()
  })

  test('направляет фокус на заголовок после нативного показа', () => {
    const focus = jest
      .spyOn(AccessibilityInfo, 'sendAccessibilityEvent')
      .mockImplementation(jest.fn())
    render(<Dialog visible header={<DialogHeader title='Детали заказа' />} />)

    expect(focus).not.toHaveBeenCalled()

    fireEvent(screen.UNSAFE_getByType(Modal), 'show')

    expect(focus).toHaveBeenCalledExactlyOnceWith(expect.anything(), 'focus')
  })
})
