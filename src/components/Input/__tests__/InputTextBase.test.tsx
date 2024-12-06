import { fireEvent, render, userEvent } from '@testing-library/react-native'
import React from 'react'

import { InputTextBase } from '../InputTextBase'

describe('InputTextBase component functionality tests', () => {
  test('should render outline elements', () => {
    const { queryByTestId } = render(<InputTextBase />)

    expect(queryByTestId('InputTextBase_dangerOutline')).toBeOnTheScreen()
    expect(queryByTestId('InputTextBase_focusOutline')).toBeOnTheScreen()
  })

  test('should NOT be render outline elements in disabled state', () => {
    const { queryByTestId } = render(<InputTextBase disabled />)

    expect(queryByTestId('InputTextBase_dangerOutline')).not.toBeOnTheScreen()
    expect(queryByTestId('InputTextBase_focusOutline')).not.toBeOnTheScreen()
  })

  test('should set editable prop correctly', () => {
    const { queryByTestId, update } = render(<InputTextBase />)

    expect(queryByTestId('InputTextBase_input')).toHaveProp('editable', true)
    update(<InputTextBase disabled />)
    expect(queryByTestId('InputTextBase_input')).toHaveProp('editable', false)
  })

  test('should handle focus event', () => {
    const onFocusMock = jest.fn()
    const { queryByTestId } = render(<InputTextBase onFocus={onFocusMock} />)
    const input = queryByTestId('InputTextBase_input')

    fireEvent(input, 'focus')
    expect(onFocusMock).toHaveBeenCalled()
  })

  test('should handle blur event', () => {
    const onBlurMock = jest.fn()
    const { queryByTestId } = render(<InputTextBase onBlur={onBlurMock} />)
    const input = queryByTestId('InputTextBase_input')

    fireEvent(input, 'blur')
    expect(onBlurMock).toHaveBeenCalled()
  })

  test('should handle text change', () => {
    const onChangeTextMock = jest.fn()
    const { queryByTestId } = render(<InputTextBase onChangeText={onChangeTextMock} />)
    const input = queryByTestId('InputTextBase_input')

    fireEvent.changeText(input, 'new text')
    expect(onChangeTextMock).toHaveBeenCalledWith('new text')
  })

  test('should show clear button only when value exists', async () => {
    const { queryByTestId } = render(<InputTextBase />)
    const input = queryByTestId('InputTextBase_input')
    const user = userEvent.setup()
    let clearButton = queryByTestId('InputTextBase_clearButton')

    expect(clearButton).not.toBeOnTheScreen()
    await user.type(input, 'text')
    clearButton = queryByTestId('InputTextBase_clearButton')
    expect(clearButton).toBeOnTheScreen()
  })

  test('should NOT show clear button when input is disabled', async () => {
    const { queryByTestId } = render(<InputTextBase disabled value='text' />)
    const clearButton = queryByTestId('InputTextBase_clearButton')

    expect(clearButton).not.toBeOnTheScreen()
  })

  test('should clear text when clear button is pressed', async () => {
    const { queryByTestId } = render(<InputTextBase />)
    const input = queryByTestId('InputTextBase_input')
    const user = userEvent.setup()

    await user.type(input, 'text')

    const clearButton = queryByTestId('InputTextBase_clearButton')

    expect(input).toHaveProp('value', 'text')
    fireEvent.press(clearButton)
    expect(input).toHaveProp('value', '')
  })

  test('should show disabled icon when input is disabled', () => {
    const { queryAllByTestId, update } = render(<InputTextBase />)
    let [disabledIcon] = queryAllByTestId('InputTextBase_disabledIcon')

    expect(disabledIcon).toBeFalsy()
    update(<InputTextBase disabled />)
    disabledIcon = queryAllByTestId('InputTextBase_disabledIcon')
    expect(disabledIcon).toBeDefined()
  })

  test('should show loading icon', () => {
    const { queryByTestId, update } = render(<InputTextBase />)
    let loadingIcon = queryByTestId('InputTextBase_loading')

    expect(loadingIcon).not.toBeOnTheScreen()
    update(<InputTextBase loading />)
    loadingIcon = queryByTestId('InputTextBase_loading')
    expect(loadingIcon).toBeOnTheScreen()
    expect(loadingIcon).toHaveAnimatedStyle({ transform: [{ rotate: '0deg' }] })
  })
})
