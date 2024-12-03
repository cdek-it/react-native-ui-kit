import { IconArrowDownRight } from '@tabler/icons-react-native'
import { act, render, userEvent } from '@testing-library/react-native'
import React from 'react'
import { Pressable } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { type SelectButtonItemProps, SelectButtonItem } from '../SelectButtonItem'

type SelectButtonItemTestProps = Partial<Omit<SelectButtonItemProps, 'position'>> & {
  position?: number
  withButton?: boolean
}

const TestComponent = ({
  position: positionProp = 0,
  onPress = jest.fn(),
  index = 0,
  withButton,
  ...rest
}: SelectButtonItemTestProps) => {
  const position = useSharedValue(positionProp)

  return (
    <>
      <SelectButtonItem index={index} position={position} onPress={onPress} {...rest} />
      {withButton && (
        <Pressable
          testID='ChangePosition'
          onPress={() => {
            position.value = position.value + 1
          }}
        />
      )}
    </>
  )
}

describe('SelectButtonItem', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  const snapshotCases: Array<[SelectButtonItemTestProps]> = [
    [{ label: 'ButtonSelect' }],
    [{ size: 'small', Icon: IconArrowDownRight }],
    [{ size: 'base', Icon: IconArrowDownRight, showIcon: false }],
    [
      {
        size: 'large',
        Icon: IconArrowDownRight,
        showIcon: true,
        label: 'ButtonSelect',
        disabled: true,
      },
    ],
    [{ size: 'xlarge', label: 'ButtonSelect', Icon: IconArrowDownRight, index: 1 }],
  ]

  test.each(snapshotCases)('%p', (props) => {
    const { toJSON } = render(<TestComponent {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })

  test('handle press', async () => {
    const mockedOnPress = jest.fn()
    const { queryByTestId } = render(<TestComponent onPress={mockedOnPress} />)
    const user = userEvent.setup()

    await act(async () => {
      const touchableOpacity = queryByTestId('SelectButtonItem_TouchableOpacity')
      await user.press(touchableOpacity)
      expect(mockedOnPress).toHaveBeenCalled()
    })
  })

  test('position change', async () => {
    const mockedOnPress = jest.fn()
    const { queryAllByTestId } = render(
      <TestComponent withButton Icon={IconArrowDownRight} onPress={mockedOnPress} />
    )
    const user = userEvent.setup()
    let icon

    await act(async () => {
      const pressable = queryAllByTestId('ChangePosition')
      icon = queryAllByTestId('SelectButtonItem_Icon')

      expect(icon[0]).toHaveStyle({ color: '#188700' })

      await user.press(pressable[0])
      jest.advanceTimersByTime(600)
    })

    icon = queryAllByTestId('SelectButtonItem_Icon')

    expect(icon[0]).toHaveStyle({ color: 'rgba(0, 0, 0, 0.6000)' })
  })
})
