import { fireEvent, render } from '@testing-library/react-native'

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
})
