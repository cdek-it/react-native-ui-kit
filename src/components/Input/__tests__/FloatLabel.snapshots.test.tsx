import { fireEvent, render } from '@testing-library/react-native'

import { FloatLabel } from '../FloatLabel'

import useFakeTimers = jest.useFakeTimers

jest.mock('../InputTextBase', () => ({ InputTextBase: 'InputTextBase' }))

describe('FloatLabel snapshots', () => {
  beforeEach(() => {
    useFakeTimers()
  })

  test('focused/unfocused snapshots', () => {
    const { toJSON, getByTestId } = render(
      <FloatLabel placeholder='Label' style={{ margin: 10 }} />
    )

    expect(toJSON()).toMatchSnapshot('unfocused')

    const inputTextBase = getByTestId('FloatLabel_InputTextBase')
    fireEvent(inputTextBase, 'focus')
    jest.runAllTimers()

    expect(toJSON()).toMatchSnapshot('focused')
  })

  test('unfocused with value snapshots, multiline', () => {
    const { toJSON } = render(
      <FloatLabel
        multiline
        placeholder='Label'
        style={{ margin: 10 }}
        value='Value'
      />
    )
    jest.runAllTimers()

    expect(toJSON()).toMatchSnapshot('focused with value')
  })
})
