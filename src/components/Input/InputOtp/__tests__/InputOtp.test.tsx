import { fireEvent, render } from '@testing-library/react-native'

import { InputOtp, type InputOtpProps } from '../InputOtp'

describe('InputOtp component tests', () => {
  const inputSnapshotCases = generatePropsCombinations<InputOtpProps>({
    disabled: [true, false],
    error: [true, false],
    testOnly_pressed: [true, false],
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
    const mockedOnComplete = jest.fn()

    const { getByTestId } = render(
      <InputOtp length={4} testID='InputOtp' onComplete={mockedOnComplete} />
    )
    const hiddenInput = getByTestId('InputOtpHiddenInput')

    fireEvent.changeText(hiddenInput, '55')

    expect(mockedOnComplete).not.toHaveBeenCalled()

    fireEvent.changeText(hiddenInput, '5543')

    expect(mockedOnComplete).toHaveBeenCalledWith('5543')
  })
})
