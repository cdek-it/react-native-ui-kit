import { IconArrowDownRight } from '@tabler/icons-react-native'
import {
  fireEvent,
  render,
  userEvent,
  waitFor,
} from '@testing-library/react-native'

import { Pressable } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { SelectButton, type SelectButtonProps } from '../SelectButton'

jest.mock('../SelectButtonItem', () => ({
  SelectButtonItem: 'SelectButtonItem',
}))

type SelectButtonTestProps = Omit<SelectButtonProps, 'buttons'> & {
  readonly controlled?: boolean
}

const buttons = [
  { label: 'ButtonSelect', Icon: IconArrowDownRight, key: 'button1' },
  {
    label: 'ButtonSelect',
    Icon: IconArrowDownRight,
    key: 'button2',
    showIcon: false,
  },
]

const TestComponent = ({ controlled, ...rest }: SelectButtonTestProps) => {
  const position = useSharedValue(0)

  return (
    <>
      <SelectButton
        buttons={buttons}
        position={controlled ? position : undefined}
        {...rest}
      />
      {controlled ? (
        <Pressable
          testID='ChangePosition'
          onPress={() => {
            position.value += 0.5
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

  const snapshotCases: Array<[SelectButtonTestProps]> = [
    [{}],
    [{ size: 'small', disabled: true, initialIndex: 1, style: { margin: 10 } }],
    [{ size: 'base', initialIndex: 2 }],
    [{ size: 'large' }],
    [{ size: 'xlarge', initialIndex: 1 }],
  ]

  test.each(snapshotCases)('%p', (props) => {
    const { toJSON, getByTestId } = render(<TestComponent {...props} />)

    buttons.forEach((_, index) => {
      fireEvent(
        getByTestId(`SelectButton_SelectButtonItem_${index}`),
        'layout',
        { nativeEvent: { layout: { width: 100, x: 100 * index } } }
      )
    })

    expect(toJSON()).toMatchSnapshot()
  })

  test('animated frame should be when disabled = true', async () => {
    const { findByTestId } = render(<TestComponent disabled={false} />)

    await expect(
      findByTestId('SelectButton_AnimatedFrame')
    ).resolves.toBeDefined()
  })

  test('animated frame should not be when disabled = false', async () => {
    const { findByTestId } = render(<TestComponent disabled />)

    await expect(
      findByTestId('SelectButton_AnimatedFrame')
    ).rejects.toBeDefined()
  })

  test('handle press on uncontrolled component', async () => {
    const mockedOnPress = jest.fn()
    const { getByTestId } = render(<TestComponent onPress={mockedOnPress} />)
    const selectButtonItem = getByTestId('SelectButton_SelectButtonItem_1')

    buttons.forEach((_, index) => {
      fireEvent(
        getByTestId(`SelectButton_SelectButtonItem_${index}`),
        'layout',
        { nativeEvent: { layout: { width: 100, x: 100 * index } } }
      )
    })

    let animatedFrame = getByTestId('SelectButton_AnimatedFrame')
    await waitFor(() =>
      expect(animatedFrame).toHaveAnimatedStyle({ left: 0, width: 100 })
    )

    selectButtonItem.props.onPress()
    animatedFrame = getByTestId('SelectButton_AnimatedFrame')

    expect(mockedOnPress).toHaveBeenCalledWith(1)

    await waitFor(() =>
      expect(animatedFrame).toHaveAnimatedStyle({ left: 100, width: 100 })
    )
  })

  test('handle press on controlled component', async () => {
    const mockedOnPress = jest.fn()
    const { getByTestId } = render(
      <TestComponent controlled onPress={mockedOnPress} />
    )
    const selectButtonItem = getByTestId('SelectButton_SelectButtonItem_1')

    buttons.forEach((_, index) => {
      fireEvent(
        getByTestId(`SelectButton_SelectButtonItem_${index}`),
        'layout',
        { nativeEvent: { layout: { width: 100, x: 100 * index } } }
      )
    })

    selectButtonItem.props.onPress()

    let animatedFrame = getByTestId('SelectButton_AnimatedFrame')
    await waitFor(() =>
      expect(animatedFrame).toHaveAnimatedStyle({ left: 0, width: 100 })
    )

    const testButton = getByTestId('ChangePosition')
    const user = userEvent.setup()

    await user.press(testButton)
    animatedFrame = getByTestId('SelectButton_AnimatedFrame')

    expect(mockedOnPress).toHaveBeenCalledWith(1)

    await waitFor(() =>
      expect(animatedFrame).toHaveAnimatedStyle({ left: 50, width: 100 })
    )
  })
})
