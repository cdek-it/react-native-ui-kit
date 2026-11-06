import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { DeviceEventEmitter, Platform } from 'react-native'

import { InputText } from '../../Input'

import { Dialog } from '../Dialog'

const showKeyboard = () =>
  act(async () => {
    DeviceEventEmitter.emit(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      {
        duration: 0,
        easing: 'keyboard',
        endCoordinates: { screenX: 0, screenY: 500, width: 400, height: 300 },
      }
    )
  })

const hideKeyboard = () =>
  act(async () => {
    DeviceEventEmitter.emit(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      {
        duration: 0,
        easing: 'keyboard',
        endCoordinates: { screenX: 0, screenY: 800, width: 400, height: 0 },
      }
    )
  })

const layoutDialog = (height = 800) =>
  fireEvent(screen.getByTestId('DialogKeyboardAvoidingView'), 'layout', {
    persist: jest.fn(),
    nativeEvent: { layout: { x: 0, y: 0, width: 400, height } },
  })

describe('Dialog: клавиатура', () => {
  afterEach(async () => {
    await hideKeyboard()
    jest.restoreAllMocks()
  })

  test('освобождает место для клавиатуры и возвращает его после скрытия', async () => {
    const onClose = jest.fn()
    render(
      <Dialog visible onClose={onClose}>
        <InputText accessibilityLabel='Комментарий' />
      </Dialog>
    )
    layoutDialog()

    await showKeyboard()

    expect(screen.getByTestId('DialogKeyboardAvoidingView')).toHaveStyle({
      paddingBottom: 300,
    })

    fireEvent.changeText(
      screen.getByLabelText('Комментарий'),
      'Сохранить текст'
    )
    await hideKeyboard()

    expect(screen.getByTestId('DialogKeyboardAvoidingView')).toHaveStyle({
      paddingBottom: 0,
    })
    expect(screen.getByDisplayValue('Сохранить текст')).toBeOnTheScreen()
    expect(onClose).not.toHaveBeenCalled()
  })

  test('позволяет отключить адаптацию и включить её при открытой клавиатуре', async () => {
    const body = <InputText accessibilityLabel='Комментарий' />
    const { rerender } = render(
      <Dialog visible avoidKeyboard={false}>
        {body}
      </Dialog>
    )
    layoutDialog()
    await showKeyboard()

    expect(screen.getByTestId('DialogKeyboardAvoidingView')).toHaveStyle({
      paddingBottom: 0,
    })

    rerender(<Dialog visible>{body}</Dialog>)

    expect(screen.getByTestId('DialogKeyboardAvoidingView')).toHaveStyle({
      paddingBottom: 300,
    })

    rerender(
      <Dialog visible avoidKeyboard={false}>
        {body}
      </Dialog>
    )

    expect(screen.getByTestId('DialogKeyboardAvoidingView')).toHaveStyle({
      paddingBottom: 0,
    })
  })

  test('учитывает текущую высоту окна Android после изменения размера и скрытия клавиатуры', async () => {
    jest.replaceProperty(Platform, 'OS', 'android')
    render(<Dialog visible />)
    layoutDialog(400)
    layoutDialog(800)

    await showKeyboard()

    expect(screen.getByTestId('DialogKeyboardAvoidingView')).toHaveStyle({
      paddingBottom: 300,
    })

    layoutDialog(500)
    await hideKeyboard()

    expect(screen.getByTestId('DialogKeyboardAvoidingView')).toHaveStyle({
      paddingBottom: 0,
    })
  })

  test('не уменьшает высоту повторно, если Android уже освободил место для клавиатуры', async () => {
    jest.replaceProperty(Platform, 'OS', 'android')
    render(<Dialog visible />)
    layoutDialog()
    layoutDialog(500)

    await showKeyboard()

    expect(screen.getByTestId('DialogKeyboardAvoidingView')).toHaveStyle({
      paddingBottom: 0,
    })
  })

  test('включает внешнюю прокрутку только с клавиатурой при нехватке места и сохраняет ввод', async () => {
    const { rerender } = render(
      <Dialog visible>
        <InputText accessibilityLabel='Комментарий' />
      </Dialog>
    )
    const scrollView = () => screen.getByTestId('DialogScrollView')
    const layoutViewport = (height: number) =>
      fireEvent(scrollView(), 'layout', {
        nativeEvent: { layout: { x: 0, y: 0, width: 336, height } },
      })

    fireEvent(scrollView(), 'contentSizeChange', 336, 600)
    layoutViewport(600)

    expect(scrollView()).toHaveProp('scrollEnabled', false)

    fireEvent.changeText(screen.getByLabelText('Комментарий'), 'Черновик')
    layoutViewport(300)

    expect(scrollView()).toHaveProp('scrollEnabled', false)

    await showKeyboard()

    expect(scrollView()).toHaveProp('scrollEnabled', true)
    expect(screen.getByDisplayValue('Черновик')).toBeOnTheScreen()

    await hideKeyboard()

    expect(scrollView()).toHaveProp('scrollEnabled', false)
    expect(screen.getByDisplayValue('Черновик')).toBeOnTheScreen()

    await showKeyboard()

    rerender(
      <Dialog visible avoidKeyboard={false}>
        <InputText accessibilityLabel='Комментарий' />
      </Dialog>
    )

    expect(scrollView()).toHaveProp('scrollEnabled', false)
    expect(screen.getByDisplayValue('Черновик')).toBeOnTheScreen()

    rerender(
      <Dialog visible>
        <InputText accessibilityLabel='Комментарий' />
      </Dialog>
    )
    layoutViewport(600)

    expect(scrollView()).toHaveProp('scrollEnabled', false)
    expect(screen.getByDisplayValue('Черновик')).toBeOnTheScreen()
  })
})
