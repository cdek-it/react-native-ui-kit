import { fireEvent, render, userEvent } from '@testing-library/react-native'

import { InputTextBase } from '../InputTextBase'

describe('InputTextBase component functionality tests', () => {
  test('should render outline elements', () => {
    const { getByTestId } = render(<InputTextBase />)

    expect(getByTestId('InputTextBase_DangerOutline')).toBeOnTheScreen()
    expect(getByTestId('InputTextBase_FocusOutline')).toBeOnTheScreen()
  })

  test('should NOT be render outline elements in disabled state', () => {
    const { queryByTestId } = render(<InputTextBase disabled />)

    expect(queryByTestId('InputTextBase_DangerOutline')).not.toBeOnTheScreen()
    expect(queryByTestId('InputTextBase_FocusOutline')).not.toBeOnTheScreen()
  })

  test('should set editable prop correctly', () => {
    const { queryByTestId, update } = render(<InputTextBase />)

    expect(queryByTestId('InputTextBase_Input')).toHaveProp('editable', true)

    update(<InputTextBase disabled />)

    expect(queryByTestId('InputTextBase_Input')).toHaveProp('editable', false)
  })

  test('should handle focus event', () => {
    const onFocusMock = jest.fn()
    const { queryByTestId } = render(<InputTextBase onFocus={onFocusMock} />)
    const input = queryByTestId('InputTextBase_Input')

    fireEvent(input, 'focus')

    expect(onFocusMock).toHaveBeenCalled()
  })

  test('should handle blur event', () => {
    const onBlurMock = jest.fn()
    const { queryByTestId } = render(<InputTextBase onBlur={onBlurMock} />)
    const input = queryByTestId('InputTextBase_Input')

    fireEvent(input, 'blur')

    expect(onBlurMock).toHaveBeenCalled()
  })

  test('should handle text change', () => {
    const onChangeTextMock = jest.fn()
    const { queryByTestId } = render(
      <InputTextBase onChangeText={onChangeTextMock} />
    )
    const input = queryByTestId('InputTextBase_Input')

    fireEvent.changeText(input, 'new text')

    expect(onChangeTextMock).toHaveBeenCalledWith('new text')
  })

  test('should show clear button only when value exists', async () => {
    const { queryByTestId } = render(<InputTextBase />)
    const input = queryByTestId('InputTextBase_Input')
    const user = userEvent.setup()
    let clearButton = queryByTestId('InputTextBase_ClearButton')

    expect(clearButton).not.toBeOnTheScreen()

    await user.type(input, 'text')
    clearButton = queryByTestId('InputTextBase_ClearButton')

    expect(clearButton).toBeOnTheScreen()
  })

  test('should NOT show clear button when input is disabled', async () => {
    const { queryByTestId } = render(<InputTextBase disabled value='text' />)
    const clearButton = queryByTestId('InputTextBase_ClearButton')

    expect(clearButton).not.toBeOnTheScreen()
  })

  test('should clear text when clear button is pressed', async () => {
    const { queryByTestId } = render(<InputTextBase />)
    const input = queryByTestId('InputTextBase_Input')
    const user = userEvent.setup()

    await user.type(input, 'text')

    const clearButton = queryByTestId('InputTextBase_ClearButton')

    expect(input).toHaveProp('value', 'text')

    fireEvent.press(clearButton)

    expect(input).toHaveProp('value', '')
  })

  test('should show disabled icon when input is disabled', () => {
    const { queryAllByTestId, update } = render(<InputTextBase />)
    let [disabledIcon] = queryAllByTestId('InputTextBase_DisabledIcon')

    expect(disabledIcon).toBeFalsy()

    update(<InputTextBase disabled />)
    disabledIcon = queryAllByTestId('InputTextBase_DisabledIcon')

    expect(disabledIcon).toBeDefined()
  })

  test('should show loading icon', () => {
    const { queryByTestId, update } = render(<InputTextBase />)
    let loadingIcon = queryByTestId('InputTextBase_Loading')

    expect(loadingIcon).not.toBeOnTheScreen()

    update(<InputTextBase loading />)
    loadingIcon = queryByTestId('InputTextBase_Loading')

    expect(loadingIcon).toBeOnTheScreen()
    expect(loadingIcon).toHaveAnimatedStyle({ transform: [{ rotate: '0deg' }] })
  })

  test('should pass args to custom render function correctly', () => {
    const renderTextInput = jest.fn()

    render(<InputTextBase renderTextInput={renderTextInput} />)

    expect(renderTextInput).toHaveBeenCalled()
    expect(renderTextInput.mock.calls[0]).toMatchSnapshot()
  })
})
