import {
  fireEvent,
  render,
  screen,
  userEvent,
} from '@testing-library/react-native'

import { Dimensions } from 'react-native'

import { Badge } from '../../Badge'

import { DialogActions } from '../DialogActions'

const layout = (testID: string, width: number) => {
  fireEvent(
    screen.getByTestId(testID, { includeHiddenElements: true }),
    'layout',
    { nativeEvent: { layout: { x: 0, y: 0, width, height: 50 } } }
  )
}

describe('DialogActions', () => {
  beforeEach(() => {
    jest
      .spyOn(Dimensions, 'get')
      .mockReturnValue({ width: 390, height: 844, scale: 3, fontScale: 1 })
  })

  afterEach(() => jest.restoreAllMocks())

  test('сохраняет порядок действий и вызывает переданный обработчик', async () => {
    const onSave = jest.fn()
    render(
      <DialogActions
        actions={[
          { key: 'save', label: 'Сохранить', onPress: onSave },
          { key: 'cancel', label: 'Отмена', variant: 'tertiary' },
          { key: 'help', label: 'Помощь', variant: 'text' },
        ]}
      />
    )

    expect(
      screen
        .getAllByRole('button')
        .map((button) => button.props.accessibilityLabel)
    ).toStrictEqual(['Сохранить', 'Отмена', 'Помощь'])

    await userEvent.press(screen.getByRole('button', { name: 'Сохранить' }))

    expect(onSave).toHaveBeenCalledOnce()
  })

  test('перестраивает действия при нехватке места и возвращает строку при расширении', () => {
    render(
      <DialogActions
        actions={[
          { key: 'cancel', label: 'Отмена', variant: 'tertiary' },
          { key: 'save', label: 'Сохранить' },
        ]}
      />
    )

    layout('DialogActions', 280)
    layout('DialogActionsMeasure-cancel', 90)
    layout('DialogActionsMeasure-save', 120)

    expect(screen.getByTestId('DialogActions')).toHaveStyle({
      flexDirection: 'row',
    })

    layout('DialogActions', 200)

    expect(screen.getByTestId('DialogActions')).toHaveStyle({
      flexDirection: 'column',
    })
    expect(
      screen
        .getAllByRole('button')
        .map((button) => button.props.accessibilityLabel)
    ).toStrictEqual(['Отмена', 'Сохранить'])

    layout('DialogActions', 300)

    expect(screen.getByTestId('DialogActions')).toHaveStyle({
      flexDirection: 'row',
    })

    layout('DialogActionsMeasure-save', 180)

    expect(screen.getByTestId('DialogActions')).toHaveStyle({
      flexDirection: 'column',
    })
  })

  test('монтирует пользовательский бейдж только у видимого действия', () => {
    render(
      <DialogActions
        actions={[
          {
            key: 'messages',
            label: 'Сообщения',
            badge: <Badge testID='ActionBadge'>3</Badge>,
          },
        ]}
      />
    )

    expect(
      screen.getAllByTestId('ActionBadge', { includeHiddenElements: true })
    ).toHaveLength(1)
  })

  test('сохраняет danger-действие на переданном месте и вызывает его обработчик', async () => {
    const onDelete = jest.fn()
    const onSave = jest.fn()
    render(
      <DialogActions
        actions={[
          {
            key: 'delete',
            label: 'Удалить',
            severity: 'danger',
            onPress: onDelete,
          },
          { key: 'save', label: 'Сохранить', onPress: onSave },
        ]}
      />
    )

    expect(
      screen
        .getAllByRole('button')
        .map((button) => button.props.accessibilityLabel)
    ).toStrictEqual(['Удалить', 'Сохранить'])

    await userEvent.press(screen.getByRole('button', { name: 'Удалить' }))

    expect(onDelete).toHaveBeenCalledOnce()
    expect(onSave).not.toHaveBeenCalled()
  })

  test('при шрифте 200% оставляет столбец даже при достаточной ширине', () => {
    jest
      .spyOn(Dimensions, 'get')
      .mockReturnValue({ width: 390, height: 844, scale: 3, fontScale: 2 })
    render(
      <DialogActions
        actions={[
          { key: 'cancel', label: 'Отмена' },
          { key: 'save', label: 'Сохранить' },
        ]}
      />
    )
    layout('DialogActions', 1000)
    layout('DialogActionsMeasure-cancel', 100)
    layout('DialogActionsMeasure-save', 120)

    expect(screen.getByTestId('DialogActions')).toHaveStyle({
      flexDirection: 'column',
    })
  })

  test('сохраняет disabled и не добавляет измерительные кнопки в доступные действия', async () => {
    const onPress = jest.fn()
    render(
      <DialogActions
        actions={[{ key: 'save', label: 'Сохранить', disabled: true, onPress }]}
      />
    )

    const buttons = screen.getAllByRole('button')

    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toBeDisabled()

    await userEvent.press(screen.getByRole('button', { name: 'Сохранить' }))

    expect(onPress).not.toHaveBeenCalled()
  })
})
