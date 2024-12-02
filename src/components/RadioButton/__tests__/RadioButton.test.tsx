import { render, userEvent } from '@testing-library/react-native'
import React from 'react'

import { RadioButton, type RadioButtonProps } from '../RadioButton'

describe('RadioButton', () => {
  const defaultProps: RadioButtonProps = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onPress: () => {},
  }

  describe('snapshots', () => {
    const snapshotCases: Array<[string, Partial<RadioButtonProps>]> = [
      ['default', {}],
      [
        'checked = true, disabled = false, state = danger',
        {
          checked: true,
          disabled: false,
          state: 'danger',
        },
      ],
      [
        'checked = false, disabled = false, state = danger',
        {
          checked: false,
          disabled: false,
          state: 'danger',
        },
      ],

      [
        'checked = true, disabled = false, state = default',
        {
          checked: true,
          disabled: false,
          state: 'default',
        },
      ],
      [
        'checked = false, disabled = false, state = default',
        {
          checked: false,
          disabled: false,
          state: 'default',
        },
      ],

      [
        'checked = true, disabled = true, state = default',
        {
          checked: true,
          disabled: true,
          state: 'default',
        },
      ],
      [
        'checked = false, disabled = true, state = default',
        {
          checked: false,
          disabled: true,
          state: 'default',
        },
      ],
    ]

    beforeAll(() => {
      jest.mock('react-native/Libraries/Components/Pressable/Pressable', () => ({
        default: 'Pressable',
      }))
    })

    afterAll(() => {
      jest.unmock('react-native/Libraries/Components/Pressable/Pressable')
    })

    test.each(snapshotCases)('%s', (_, props) => {
      const { toJSON } = render(<RadioButton {...defaultProps} {...props} />)
      expect(toJSON()).toMatchSnapshot()
    })
  })

  test('should handle press', async () => {
    const mockedOnPress = jest.fn()
    const { queryByTestId } = render(<RadioButton onPress={mockedOnPress} />)
    const pressable = queryByTestId('RadioButton_Pressable')
    const user = userEvent.setup()

    await user.press(pressable)
    expect(mockedOnPress).toHaveBeenCalled()
  })

  test('should NOT handle press', async () => {
    const mockedOnPress = jest.fn()
    const { queryByTestId } = render(<RadioButton disabled onPress={mockedOnPress} />)
    const pressable = queryByTestId('RadioButton_Pressable')
    const user = userEvent.setup()

    await user.press(pressable)
    expect(mockedOnPress).not.toHaveBeenCalled()
  })
})
