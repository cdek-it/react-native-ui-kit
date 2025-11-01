import { fireEvent, render } from '@testing-library/react-native'

import { FloatLabel, FloatLabelTestId } from '../FloatLabel'

import useFakeTimers = jest.useFakeTimers

jest.mock('../InputTextBase/InputTextBase', () => ({
  InputTextBase: 'InputTextBase',
}))

describe('FloatLabel snapshots', () => {
  beforeEach(() => {
    useFakeTimers()
  })

  test('focused/unfocused snapshots', () => {
    const { toJSON, getByTestId } = render(
      <FloatLabel placeholder='Label' style={{ margin: 10 }} />
    )

    expect(toJSON()).toMatchSnapshot('unfocused')

    const inputTextBase = getByTestId(FloatLabelTestId.root)
    fireEvent(inputTextBase, 'focus')
    jest.runAllTimers()

    expect(toJSON()).toMatchSnapshot('focused')
  })

  test('unfocused with value snapshots, multiline, custom testID', () => {
    const { toJSON } = render(
      <FloatLabel
        multiline
        placeholder='Label'
        style={{ margin: 10 }}
        testID='CustomTestId'
        value='Value'
      />
    )
    jest.runAllTimers()

    expect(toJSON()).toMatchSnapshot('focused with value')
  })
})
