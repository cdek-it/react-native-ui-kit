import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { Dimensions, StyleSheet, Text } from 'react-native'

import { InputText } from '../../Input'

import { Dialog } from '../Dialog'

const initialWindow = Dimensions.get('window')
const resizeWindow = (height: number) =>
  act(() => {
    Dimensions.set({ window: { ...initialWindow, width: 360, height } })
  })
const layout = (testID: string, height: number) =>
  fireEvent(screen.getByTestId(testID), 'layout', {
    nativeEvent: { layout: { x: 0, y: 0, width: 336, height } },
  })
const bodyHeightLimit = () =>
  StyleSheet.flatten(screen.getByTestId('DialogBody').props.style).maxHeight

describe('Dialog: ограничение высоты body', () => {
  afterEach(() => {
    act(() => Dimensions.set({ window: initialWindow }))
  })

  test('при уменьшении окна отдаёт переполнение внешней прокрутке и сохраняет ввод', () => {
    resizeWindow(640)
    render(
      <Dialog
        visible
        footer={<Text>Действия</Text>}
        header={<Text>Шапка</Text>}
      >
        <InputText accessibilityLabel='Комментарий' />
      </Dialog>
    )
    layout('DialogHeaderContainer', 72)
    layout('DialogFooterContainer', 188)
    const regularLimit = bodyHeightLimit()
    fireEvent.changeText(screen.getByLabelText('Комментарий'), 'Черновик')

    resizeWindow(400)

    // При сжатии окна расширяется содержимое внешней прокрутки, а не обнуляется body.
    expect(bodyHeightLimit()).toBeGreaterThan(regularLimit)
    expect(screen.getByDisplayValue('Черновик')).toBeOnTheScreen()

    resizeWindow(640)

    expect(bodyHeightLimit()).toBe(regularLimit)
    expect(screen.getByDisplayValue('Черновик')).toBeOnTheScreen()
  })

  test('пересчитывает доступное место при росте и удалении футера', () => {
    resizeWindow(640)
    const header = <Text>Шапка</Text>
    const body = <Text>Содержимое</Text>
    const { rerender } = render(
      <Dialog visible footer={<Text>Действия</Text>} header={header}>
        {body}
      </Dialog>
    )
    layout('DialogHeaderContainer', 72)
    layout('DialogFooterContainer', 72)
    const regularLimit = bodyHeightLimit()

    layout('DialogFooterContainer', 188)

    expect(bodyHeightLimit()).toBeLessThan(regularLimit)

    rerender(
      <Dialog visible header={header}>
        {body}
      </Dialog>
    )

    expect(bodyHeightLimit()).toBeGreaterThan(regularLimit)
  })
})
