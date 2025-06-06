import { fireEvent, render, userEvent } from '@testing-library/react-native'

import { TextInput } from 'react-native-gesture-handler'

import { InputTextBase, type RenderTextInputArgs } from '../InputTextBase'

describe('InputTextBase component functionality tests', () => {
  test('should render outline elements', () => {
    const { getByTestId } = render(<InputTextBase />)

    expect(getByTestId('InputTextBaseDangerOutline')).toBeOnTheScreen()
    expect(getByTestId('InputTextBaseFocusOutline')).toBeOnTheScreen()
  })

  test('should NOT be render outline elements in disabled state', () => {
    const { queryByTestId } = render(<InputTextBase disabled />)

    expect(queryByTestId('InputTextBaseDangerOutline')).not.toBeOnTheScreen()
    expect(queryByTestId('InputTextBaseFocusOutline')).not.toBeOnTheScreen()
  })

  test('should set editable prop correctly', () => {
    const { queryByTestId, update } = render(<InputTextBase />)

    expect(queryByTestId('InputTextBase')).toHaveProp('editable', true)

    update(<InputTextBase disabled />)

    expect(queryByTestId('InputTextBase')).toHaveProp('editable', false)
  })

  test('should handle focus event', () => {
    const onFocusMock = jest.fn()
    const { queryByTestId } = render(<InputTextBase onFocus={onFocusMock} />)
    const input = queryByTestId('InputTextBase')

    fireEvent(input, 'focus')

    expect(onFocusMock).toHaveBeenCalled()
  })

  test('should handle blur event', () => {
    const onBlurMock = jest.fn()
    const { queryByTestId } = render(<InputTextBase onBlur={onBlurMock} />)
    const input = queryByTestId('InputTextBase')

    fireEvent(input, 'blur')

    expect(onBlurMock).toHaveBeenCalled()
  })

  test('should handle text change', () => {
    const onChangeTextMock = jest.fn()
    const { queryByTestId } = render(
      <InputTextBase onChangeText={onChangeTextMock} />
    )
    const input = queryByTestId('InputTextBase')

    fireEvent.changeText(input, 'new text')

    expect(onChangeTextMock).toHaveBeenCalledWith('new text')
  })

  test('should show clear button only when value exists', async () => {
    const { queryByTestId } = render(<InputTextBase />)
    const input = queryByTestId('InputTextBase')
    const user = userEvent.setup()
    let clearButton = queryByTestId('InputTextBaseClearButton')

    expect(clearButton).not.toBeOnTheScreen()

    await user.type(input, 'text')
    clearButton = queryByTestId('InputTextBaseClearButton')

    expect(clearButton).toBeOnTheScreen()
  })

  test('should NOT show clear button when input is disabled', async () => {
    const { queryByTestId } = render(<InputTextBase disabled value='text' />)
    const clearButton = queryByTestId('InputTextBaseClearButton')

    expect(clearButton).not.toBeOnTheScreen()
  })

  test('should clear text when clear button is pressed', async () => {
    const { queryByTestId } = render(<InputTextBase />)
    const input = queryByTestId('InputTextBase')
    const user = userEvent.setup()

    await user.type(input, 'text')

    const clearButton = queryByTestId('InputTextBaseClearButton')

    expect(input).toHaveProp('value', 'text')

    fireEvent.press(clearButton)

    expect(input).toHaveProp('value', '')
  })

  test('should show disabled icon when input is disabled', () => {
    const { queryAllByTestId, update } = render(<InputTextBase />)
    let [disabledIcon] = queryAllByTestId('InputTextBaseDisabledIcon')

    expect(disabledIcon).toBeFalsy()

    update(<InputTextBase disabled />)
    disabledIcon = queryAllByTestId('InputTextBaseDisabledIcon')

    expect(disabledIcon).toBeDefined()
  })

  test('should show loading icon', () => {
    const { queryByTestId, update } = render(<InputTextBase />)
    let loadingIcon = queryByTestId('InputTextBaseLoading')

    expect(loadingIcon).not.toBeOnTheScreen()

    update(<InputTextBase loading />)
    loadingIcon = queryByTestId('InputTextBaseLoading')

    expect(loadingIcon).toBeOnTheScreen()
    expect(loadingIcon).toHaveAnimatedStyle({ transform: [{ rotate: '0deg' }] })
  })

  test('should pass args to custom render function correctly', () => {
    const renderTextInput = jest.fn()

    render(<InputTextBase renderTextInput={renderTextInput} />)

    expect(renderTextInput).toHaveBeenCalled()
    expect(renderTextInput.mock.calls[0]).toMatchSnapshot()
  })

  test('should set clear button accessibility label', () => {
    const renderTextInput = (props: RenderTextInputArgs) => (
      <TextInput {...props} testID='MyTextInput' />
    )

    const { getByTestId } = render(
      <InputTextBase
        clearable
        clearButtonAccessibilityLabel='Clear'
        renderTextInput={renderTextInput}
      />
    )
    const input = getByTestId('MyTextInput')
    fireEvent.changeText(input, 'ку')

    const clearButton = getByTestId('InputTextBaseClearButton')

    expect(clearButton.props.accessibilityLabel).toBe('Clear')
  })
})
