import { render, screen, userEvent } from '@testing-library/react-native'

import { DialogActions } from '../DialogActions'

describe('DialogActions', () => {
  test('сохраняет порядок обычных и danger-действий и вызывает их обработчики', async () => {
    const onSave = jest.fn()
    const onDelete = jest.fn()
    const user = userEvent.setup()
    render(
      <DialogActions
        actions={[
          { key: 'save', label: 'Сохранить', onPress: onSave },
          {
            key: 'delete',
            label: 'Удалить',
            severity: 'danger',
            onPress: onDelete,
          },
          { key: 'cancel', label: 'Отмена', variant: 'tertiary' },
        ]}
      />
    )

    expect(
      screen
        .getAllByRole('button')
        .map((button) => button.props.accessibilityLabel)
    ).toStrictEqual(['Сохранить', 'Удалить', 'Отмена'])

    await user.press(screen.getByRole('button', { name: 'Сохранить' }))

    expect(onSave).toHaveBeenCalledOnce()
    expect(onDelete).not.toHaveBeenCalled()

    await user.press(screen.getByRole('button', { name: 'Удалить' }))

    expect(onSave).toHaveBeenCalledOnce()
    expect(onDelete).toHaveBeenCalledOnce()
  })

  test('недоступное действие не вызывает обработчик', async () => {
    const onPress = jest.fn()
    render(
      <DialogActions
        actions={[{ key: 'save', label: 'Сохранить', disabled: true, onPress }]}
      />
    )
    const button = screen.getByRole('button', { name: 'Сохранить' })

    expect(button).toBeDisabled()

    await userEvent.press(button)

    expect(onPress).not.toHaveBeenCalled()
  })
})
