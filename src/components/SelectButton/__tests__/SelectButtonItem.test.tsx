import { IconArrowDownRight } from '@tabler/icons-react-native'
import { act, render, userEvent, waitFor } from '@testing-library/react-native'

import { Pressable } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import {
  type SelectButtonItemProps,
  SelectButtonItem,
} from '../SelectButtonItem'

type SelectButtonItemTestProps = Partial<
  Omit<SelectButtonItemProps, 'position'>
> & { readonly position?: number; readonly withButton?: boolean }

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
      <SelectButtonItem
        index={index}
        position={position}
        onPress={onPress}
        {...rest}
      />
      {withButton ? (
        <Pressable
          testID='ChangePosition'
          onPress={() => {
            position.value += 1
          }}
        />
      ) : null}
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
    [
      {
        size: 'xlarge',
        label: 'ButtonSelect',
        Icon: IconArrowDownRight,
        index: 1,
      },
    ],
  ]

  test.each(snapshotCases)('%p', async (props) => {
    const { toJSON } = render(<TestComponent {...props} />)
    await act(async () => {
      jest.advanceTimersByTime(600)

      expect(toJSON()).toMatchSnapshot()
    })
  })

  test('handle press', async () => {
    const mockedOnPress = jest.fn()
    const { queryByTestId } = render(<TestComponent onPress={mockedOnPress} />)
    const user = userEvent.setup()

    const touchableOpacity = queryByTestId('SelectButtonItem_TouchableOpacity')
    await user.press(touchableOpacity)

    expect(mockedOnPress).toHaveBeenCalled()
  })

  test('position change', async () => {
    const mockedOnPress = jest.fn()
    const { queryAllByTestId } = render(
      <TestComponent
        withButton
        Icon={IconArrowDownRight}
        onPress={mockedOnPress}
      />
    )
    const user = userEvent.setup()
    const pressable = queryAllByTestId('ChangePosition')
    let icons = queryAllByTestId('SelectButtonItem_Icon')

    await waitFor(() => expect(icons[0]).toHaveStyle({ color: '#188700' }))

    await user.press(pressable[0])
    jest.advanceTimersByTime(600)

    icons = queryAllByTestId('SelectButtonItem_Icon')

    expect(icons[0]).toHaveStyle({ color: 'rgba(0, 0, 0, 0.6000)' })
  })
})
