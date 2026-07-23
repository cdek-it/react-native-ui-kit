import { IconArrowDownRight } from '@tabler/icons-react-native'
import { act, render, userEvent, waitFor } from '@testing-library/react-native'

import { Pressable } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { lightTheme } from '../../../theme'
import {
  type SelectButtonItemProps,
  SelectButtonItem,
} from '../SelectButtonItem'

type SelectButtonItemTestProps = Partial<
  Omit<SelectButtonItemProps, 'position'>
> & { readonly position?: number; readonly withPositionControl?: boolean }

type SelectButtonSize = NonNullable<SelectButtonItemProps['size']>

const toRgba = (color: string) => {
  const red = Number.parseInt(color.slice(1, 3), 16)
  const green = Number.parseInt(color.slice(3, 5), 16)
  const blue = Number.parseInt(color.slice(5, 7), 16)

  return `rgba(${red}, ${green}, ${blue}, 1)`
}

const TestComponent = ({
  position: positionProp = 0,
  onPress = jest.fn(),
  index = 0,
  withPositionControl,
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
      {withPositionControl ? (
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

const sizeCases: Array<{
  name: string
  size: SelectButtonSize
  height: number
  iconSize: number
  fontSize: number
}> = [
  {
    name: 'маленький',
    size: 'small',
    height: lightTheme.theme.Button.Common.buttonHeightSM,
    iconSize: lightTheme.typography.Size['text-base'],
    fontSize: lightTheme.typography.Size['text-sm'],
  },
  {
    name: 'базовый',
    size: 'base',
    height: lightTheme.theme.Button.Common.buttonHeight,
    iconSize: lightTheme.typography.Size['text-xl'],
    fontSize: lightTheme.typography.Size['text-base'],
  },
  {
    name: 'большой',
    size: 'large',
    height: lightTheme.theme.Button.Common.buttonHeightLG,
    iconSize: lightTheme.typography.Size['text-2xl'],
    fontSize: lightTheme.typography.Size['text-xl'],
  },
  {
    name: 'самый большой',
    size: 'xlarge',
    height: lightTheme.theme.Button.Common.buttonHeightXL,
    iconSize: 28,
    fontSize: lightTheme.typography.Size['text-2xl'],
  },
]

describe('SelectButtonItem', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    act(() => jest.runOnlyPendingTimers())
    jest.useRealTimers()
  })

  test('отображает текст кнопки', () => {
    const { getByText } = render(<TestComponent label='Текст кнопки' />)

    expect(getByText('Текст кнопки')).toBeDefined()
  })

  test.each([
    {
      name: 'показывает переданную иконку по умолчанию',
      props: { Icon: IconArrowDownRight },
      isVisible: true,
    },
    {
      name: 'скрывает иконку при showIcon=false',
      props: { Icon: IconArrowDownRight, showIcon: false },
      isVisible: false,
    },
    {
      name: 'не отображает отсутствующую иконку',
      props: { showIcon: true },
      isVisible: false,
    },
  ])('$name', ({ props, isVisible }) => {
    const { queryAllByTestId } = render(<TestComponent {...props} />)

    expect(queryAllByTestId('SelectButtonItem_Icon').length > 0).toBe(isVisible)
  })

  test.each(sizeCases)(
    'применяет $name размер',
    ({ size, height, iconSize, fontSize }) => {
      const { getAllByTestId, getByTestId } = render(
        <TestComponent Icon={IconArrowDownRight} label='Текст' size={size} />
      )
      const icon = getAllByTestId('SelectButtonItem_Icon')[0]

      expect(getByTestId('SelectButtonItem_TouchableOpacity')).toHaveStyle({
        height,
      })
      expect(getByTestId('SelectButtonItem_Text')).toHaveStyle({ fontSize })
      expect(icon).toHaveProp('width', iconSize)
      expect(icon).toHaveProp('height', iconSize)
    }
  )

  test('использует переданный testID', () => {
    const { getByTestId } = render(<TestComponent testID='CustomTestId' />)

    expect(getByTestId('CustomTestId')).toBeDefined()
  })

  test('вызывает onPress при нажатии', async () => {
    const mockedOnPress = jest.fn()
    const { getByTestId } = render(<TestComponent onPress={mockedOnPress} />)
    const user = userEvent.setup()

    await user.press(getByTestId('SelectButtonItem_TouchableOpacity'))

    expect(mockedOnPress).toHaveBeenCalledOnce()
  })

  test('не вызывает onPress, если кнопка недоступна', async () => {
    const mockedOnPress = jest.fn()
    const { getByTestId } = render(
      <TestComponent disabled onPress={mockedOnPress} />
    )
    const user = userEvent.setup()
    const button = getByTestId('SelectButtonItem_TouchableOpacity')

    expect(button).toBeDisabled()

    await user.press(button)

    expect(mockedOnPress).not.toHaveBeenCalled()
  })

  describe('изменение позиции', () => {
    test('обновляет цвет текста и иконки', async () => {
      const { getAllByTestId, getByTestId } = render(
        <TestComponent
          withPositionControl
          Icon={IconArrowDownRight}
          label='Текст'
        />
      )
      const user = userEvent.setup()
      const icon = getAllByTestId('SelectButtonItem_Icon')[0]
      const text = getByTestId('SelectButtonItem_Text')

      await waitFor(() => {
        expect(icon).toHaveProp(
          'stroke',
          lightTheme.theme.Form.SelectButton.selectButtonIconActiveColor
        )
        expect(text).toHaveAnimatedStyle({
          color: toRgba(
            lightTheme.theme.Form.SelectButton.selectButtonIconActiveColor
          ),
        })
      })

      await user.press(getByTestId('ChangePosition'))
      act(() => jest.advanceTimersByTime(600))

      await waitFor(() => {
        expect(icon).toHaveProp(
          'stroke',
          lightTheme.theme.Form.SelectButton.selectButtonTextColor
        )
        expect(text).toHaveAnimatedStyle({
          color: toRgba(
            lightTheme.theme.Form.SelectButton.selectButtonTextColor
          ),
        })
      })
    })
  })
})
