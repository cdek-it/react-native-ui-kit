import { IconArrowDownRight } from '@tabler/icons-react-native'
import { render, userEvent } from '@testing-library/react-native'
import React from 'react'

import { ToggleButton, type ToggleButtonProps, ToggleButtonTestId } from '../ToggleButton'

describe('ToggleButton', () => {
  const defaultProps: ToggleButtonProps = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onPress: () => {},
  }

  describe('snapshots', () => {
    const snapshotCases: Array<[string, Partial<ToggleButtonProps>]> = [
      ['default', {}],
      [
        'checked = true, disabled = false, iconOnly = false, size = xlarge, with style, with Icon',
        {
          checked: true,
          disabled: false,
          iconOnly: false,
          size: 'xlarge',
          style: { margin: 10 },
          Icon: IconArrowDownRight,
        },
      ],
      [
        'checked = false, disabled = true, iconOnly = false, size = large, with Icon, with label',
        {
          checked: false,
          disabled: true,
          iconOnly: false,
          size: 'large',
          Icon: IconArrowDownRight,
          label: 'ButtonToggle',
        },
      ],
      [
        'checked = false, disabled = false, iconOnly = true, size = base, with Icon, with label',
        {
          checked: false,
          disabled: false,
          iconOnly: true,
          size: 'base',
          Icon: IconArrowDownRight,
          label: 'ButtonToggle',
        },
      ],
      [
        'checked = false, disabled = false, iconOnly = false, size = small, with Icon, with label, iconPos = left',
        {
          checked: false,
          disabled: false,
          iconOnly: false,
          size: 'small',
          Icon: IconArrowDownRight,
          label: 'ButtonToggle',
          iconPos: 'left',
        },
      ],
      [
        'checked = false, disabled = false, iconOnly = false, size = small, with Icon, with label, iconPos = right',
        {
          checked: false,
          disabled: false,
          iconOnly: false,
          size: 'small',
          Icon: IconArrowDownRight,
          label: 'ButtonToggle',
          iconPos: 'right',
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
      const { toJSON } = render(<ToggleButton {...defaultProps} {...props} />)
      expect(toJSON()).toMatchSnapshot()
    })
  })

  test('should handle press', async () => {
    const mockedOnPress = jest.fn()
    const { queryByTestId } = render(<ToggleButton onPress={mockedOnPress} />)
    const pressable = queryByTestId(ToggleButtonTestId.root)
    const user = userEvent.setup()

    await user.press(pressable)
    expect(mockedOnPress).toHaveBeenCalled()
  })

  test('should NOT handle press', async () => {
    const mockedOnPress = jest.fn()
    const { queryByTestId } = render(<ToggleButton disabled onPress={mockedOnPress} />)
    const pressable = queryByTestId(ToggleButtonTestId.root)
    const user = userEvent.setup()

    await user.press(pressable)
    expect(mockedOnPress).not.toHaveBeenCalled()
  })
})
