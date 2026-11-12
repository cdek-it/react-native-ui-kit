import {
  fireEvent,
  render,
  screen,
  userEvent,
} from '@testing-library/react-native'
import { memo } from 'react'
import { Modal, Text } from 'react-native'

import { DialogComponent } from '..'
import { Dialog, DialogTestId } from '../Dialog'
import { DialogHeader } from '../DialogHeader'

describe('Dialog', () => {
  test('показывает готовые шапку и футер и содержимое children', () => {
    render(
      <Dialog visible footer={<Text>Футер</Text>} header={<Text>Шапка</Text>}>
        <Text>Содержимое</Text>
      </Dialog>
    )

    expect(screen.getByText('Шапка')).toBeOnTheScreen()
    expect(screen.getByText('Содержимое')).toBeOnTheScreen()
    expect(screen.getByText('Футер')).toBeOnTheScreen()
  })

  test('сохраняет старые props и компонентную форму футера', () => {
    const Body = () => <Text>Прежнее содержимое</Text>
    const Footer = memo(() => <Text>Прежний футер</Text>)
    render(<Dialog isVisible body={Body} footer={Footer} />)

    expect(screen.getByText('Прежнее содержимое')).toBeOnTheScreen()
    expect(screen.getByText('Прежний футер')).toBeOnTheScreen()
  })

  test('показывает DialogComponent в разметке без модального окна', () => {
    render(
      <DialogComponent
        footer={<Text>Футер</Text>}
        header={<DialogHeader title='Детали заказа' />}
      >
        <Text>Содержимое</Text>
      </DialogComponent>
    )

    expect(
      screen.getByRole('header', { name: 'Детали заказа' })
    ).toBeOnTheScreen()
    expect(screen.getByText('Содержимое')).toBeOnTheScreen()
    expect(screen.getByText('Футер')).toBeOnTheScreen()
    expect(screen.UNSAFE_queryByType(Modal)).toBeNull()
  })

  test('отдаёт приоритет children перед body, включая явный null', () => {
    const Body = () => <Text>Прежнее содержимое</Text>
    const { rerender } = render(
      <Dialog visible body={Body}>
        <Text>Новое содержимое</Text>
      </Dialog>
    )

    expect(screen.getByText('Новое содержимое')).toBeOnTheScreen()
    expect(screen.queryByText('Прежнее содержимое')).not.toBeOnTheScreen()

    rerender(
      <Dialog visible body={Body}>
        {null}
      </Dialog>
    )

    expect(screen.queryByText('Новое содержимое')).not.toBeOnTheScreen()
    expect(screen.queryByText('Прежнее содержимое')).not.toBeOnTheScreen()
  })

  test('явный visible=false имеет приоритет над isVisible=true', () => {
    render(
      <Dialog isVisible visible={false}>
        <Text>Содержимое</Text>
      </Dialog>
    )

    expect(screen.queryByText('Содержимое')).not.toBeOnTheScreen()
  })

  test('остаётся скрытым без управляющего prop', () => {
    render(
      <Dialog>
        <Text>Содержимое</Text>
      </Dialog>
    )

    expect(screen.queryByText('Содержимое')).not.toBeOnTheScreen()
  })

  test('нажатия запрашивают закрытие, сохраняя окно до изменения visible', async () => {
    const onClose = jest.fn()
    const user = userEvent.setup()
    render(
      <Dialog
        visible
        header={<DialogHeader title='Заказ' onClose={onClose} />}
        onClose={onClose}
      >
        <Text>Содержимое</Text>
      </Dialog>
    )
    await user.press(
      screen.getByTestId(DialogTestId.backdrop, { includeHiddenElements: true })
    )
    await user.press(screen.getByRole('button', { name: 'Закрыть диалог' }))

    expect(onClose.mock.calls).toStrictEqual([[], []])
    expect(screen.getByText('Содержимое')).toBeOnTheScreen()
  })

  test('запрет закрытия по фону не блокирует системное закрытие', async () => {
    const onClose = jest.fn()
    const user = userEvent.setup()
    render(<Dialog visible closeOnBackdropPress={false} onClose={onClose} />)
    await user.press(
      screen.getByTestId(DialogTestId.backdrop, { includeHiddenElements: true })
    )

    expect(onClose).not.toHaveBeenCalled()

    fireEvent(screen.UNSAFE_getByType(Modal), 'requestClose')

    expect(onClose).toHaveBeenCalledExactlyOnceWith()
  })
})
