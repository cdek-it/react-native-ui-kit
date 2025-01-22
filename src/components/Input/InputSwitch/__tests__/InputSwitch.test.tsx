import { act, render, userEvent } from '@testing-library/react-native'
import React from 'react'

import { InputSwitch, type InputSwitchProps } from '../InputSwitch'

describe('InputSwitch component tests', () => {
  const inputSnapshotCases = generatePropsCombinations<InputSwitchProps>({
    disabled: [true, false],
    danger: [true, false],
    checked: [true, false],
    testOnly_pressed: [true, false],
  })

  test.each(inputSnapshotCases)(
    'checked - $checked, danger - $danger, disabled - $disabled, pressed - $testOnly_pressed',
    (props) => {
      const renderSwitch = render(<InputSwitch {...props} />)
      expect(renderSwitch.toJSON()).toMatchSnapshot()
    }
  )

  test('Handle press', async () => {
    const mockedOnCheckedChange = jest.fn()

    const { getByTestId } = render(
      <InputSwitch checked testID='InputSwitch' onCheckedChange={mockedOnCheckedChange} />
    )
    const pressableContainer = getByTestId('InputSwitch')
    const user = userEvent.setup()

    expect(mockedOnCheckedChange).not.toHaveBeenCalled()
    await act(async () => {
      await user.press(pressableContainer)
    })
    expect(mockedOnCheckedChange).toHaveBeenCalledWith(false)
  })
})
