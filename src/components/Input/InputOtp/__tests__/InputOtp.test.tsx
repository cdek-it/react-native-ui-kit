import { fireEvent, render } from '@testing-library/react-native'
import type { TextInput } from 'react-native'

import { InputOtp, type InputOtpProps } from '../InputOtp'

describe('InputOtp component tests', () => {
  const inputSnapshotCases = generatePropsCombinations<InputOtpProps>({
    disabled: [true, false],
    error: [true, false],
    testOnly_pressed: [true, false],
    value: [undefined, '5', '55'],
    onChange: [jest.fn()],
    length: [2, 4, 8],
  })

  test.each(inputSnapshotCases)(
    'length - $length, error - $error, disabled - $disabled, pressed - $testOnly_pressed',
    (props) => {
      const renderInput = render(<InputOtp {...props} />)

      expect(renderInput.toJSON()).toMatchSnapshot()
    }
  )

  test('Handle input', async () => {
    const mockedOnChange = jest.fn()

    const { getByTestId } = render(
      <InputOtp length={4} testID='InputOtp' onChange={mockedOnChange} />
    )
    const hiddenInput = getByTestId('InputOtpHiddenInput')

    expect(mockedOnChange).not.toHaveBeenCalled()

    fireEvent.changeText(hiddenInput, '55')

    expect(mockedOnChange).toHaveBeenCalledWith('55')

    fireEvent.changeText(hiddenInput, '5543')

    expect(mockedOnChange).toHaveBeenCalledWith('5543')

    fireEvent.changeText(hiddenInput, '55   ')

    expect(mockedOnChange).toHaveBeenCalledWith('55')
  })

  test('should set hidden input editable prop correctly', () => {
    const mockedOnChange = jest.fn()
    const { getByTestId, update } = render(
      <InputOtp length={4} testID='InputOtp' onChange={mockedOnChange} />
    )

    expect(getByTestId('InputOtpHiddenInput')).toHaveProp('editable', true)

    update(
      <InputOtp
        disabled
        length={4}
        testID='InputOtp'
        onChange={mockedOnChange}
      />
    )

    expect(getByTestId('InputOtpHiddenInput')).toHaveProp('editable', false)

    update(
      <InputOtp
        editable={false}
        length={4}
        testID='InputOtp'
        onChange={mockedOnChange}
      />
    )

    expect(getByTestId('InputOtpHiddenInput')).toHaveProp('editable', false)
  })

  test('should blur and reset focus when input becomes disabled', () => {
    const mockedOnChange = jest.fn()
    let inputRef: TextInput | null = null
    const handleInputRef = (ref: TextInput | null) => {
      inputRef = ref
    }
    const { getByTestId, getByText, queryByText, update } = render(
      <InputOtp
        inputRef={handleInputRef}
        length={4}
        testID='InputOtp'
        onChange={mockedOnChange}
      />
    )

    fireEvent(getByTestId('InputOtpHiddenInput'), 'focus')

    expect(getByText('|')).toBeOnTheScreen()

    if (!inputRef) {
      throw new Error('Input ref was not set')
    }

    const blur = jest.fn()

    Object.assign(inputRef, { blur, isFocused: () => true })

    update(
      <InputOtp
        disabled
        inputRef={handleInputRef}
        length={4}
        testID='InputOtp'
        onChange={mockedOnChange}
      />
    )

    expect(blur).toHaveBeenCalledOnce()
    expect(queryByText('|')).not.toBeOnTheScreen()
  })

  test('should not focus hidden input on press when input is not editable', () => {
    const mockedOnChange = jest.fn()
    let inputRef: TextInput | null = null
    const handleInputRef = (ref: TextInput | null) => {
      inputRef = ref
    }
    const { getByTestId } = render(
      <InputOtp
        editable={false}
        inputRef={handleInputRef}
        length={4}
        testID='InputOtp'
        onChange={mockedOnChange}
      />
    )

    if (!inputRef) {
      throw new Error('Input ref was not set')
    }

    const focus = jest.fn()

    Object.assign(inputRef, { focus })

    fireEvent.press(getByTestId('InputOtp'))

    expect(focus).not.toHaveBeenCalled()
  })
})
