import { IconArrowDownRight } from '@tabler/icons-react-native'
import {
  act,
  fireEvent,
  render,
  userEvent,
  waitFor,
} from '@testing-library/react-native'

import { Pressable } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { SelectButton, type SelectButtonProps } from '../SelectButton'

type SelectButtonTestProps = Omit<SelectButtonProps, 'buttons'>

type AnimatedTestComponentProps = Omit<
  SelectButtonTestProps,
  'selectedIndex' | 'position'
>

type GetByTestId = ReturnType<typeof render>['getByTestId']

const buttons = [
  { label: 'Первая кнопка', Icon: IconArrowDownRight, key: 'button1' },
  {
    label: 'Вторая кнопка',
    Icon: IconArrowDownRight,
    key: 'button2',
    showIcon: false,
  },
]

const layoutButtons = (getByTestId: GetByTestId) => {
  buttons.forEach((_, index) => {
    fireEvent(getByTestId(`SelectButton_SelectButtonItem_${index}`), 'layout', {
      nativeEvent: { layout: { width: 100, x: 100 * index } },
    })
  })
}

const TestComponent = (props: SelectButtonTestProps) => (
  <SelectButton buttons={buttons} {...props} />
)

const AnimatedTestComponent = (props: AnimatedTestComponentProps) => {
  const position = useSharedValue(0)

  return (
    <>
      <SelectButton buttons={buttons} position={position} {...props} />
      <Pressable
        testID='ChangePosition'
        onPress={() => {
          position.value += 0.5
        }}
      />
    </>
  )
}

describe('SelectButton', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    act(() => jest.runOnlyPendingTimers())
    jest.useRealTimers()
  })

  describe('общие состояния', () => {
    test('отображает рамку, если компонент доступен', () => {
      const { getByTestId } = render(<TestComponent disabled={false} />)

      expect(getByTestId('SelectButton_AnimatedFrame')).toBeDefined()
    })

    test('не отображает рамку, если компонент недоступен', () => {
      const { queryByTestId } = render(<TestComponent disabled />)

      expect(queryByTestId('SelectButton_AnimatedFrame')).toBeNull()
    })

    test('не вызывает onPress, если компонент недоступен', async () => {
      const mockedOnPress = jest.fn()
      const { getByRole } = render(
        <TestComponent disabled onPress={mockedOnPress} />
      )
      const user = userEvent.setup()
      const button = getByRole('button', {
        disabled: true,
        name: 'Вторая кнопка',
      })

      await user.press(button)

      expect(mockedOnPress).not.toHaveBeenCalled()
    })

    test('передает доступное имя кнопке без текста', () => {
      const { getByRole } = render(
        <SelectButton
          buttons={[
            {
              accessibilityLabel: 'Первая кнопка',
              Icon: IconArrowDownRight,
              key: 'icon-only',
            },
            { label: 'Вторая кнопка', key: 'with-label' },
          ]}
        />
      )

      expect(getByRole('button', { name: 'Первая кнопка' })).toBeDefined()
    })
  })

  describe('неконтролируемый режим', () => {
    test('устанавливает начальную позицию из initialIndex', async () => {
      const { getByTestId } = render(<TestComponent initialIndex={1} />)

      layoutButtons(getByTestId)

      await waitFor(() =>
        expect(getByTestId('SelectButton_AnimatedFrame')).toHaveAnimatedStyle({
          left: 100,
          width: 100,
        })
      )
    })

    test('не изменяет позицию при обновлении initialIndex', async () => {
      const { getByTestId, rerender } = render(
        <TestComponent initialIndex={0} />
      )

      layoutButtons(getByTestId)

      const animatedFrame = getByTestId('SelectButton_AnimatedFrame')
      await waitFor(() =>
        expect(animatedFrame).toHaveAnimatedStyle({ left: 0, width: 100 })
      )

      rerender(<TestComponent initialIndex={1} />)

      expect(animatedFrame).toHaveAnimatedStyle({ left: 0, width: 100 })
    })

    test('меняет выбранный индекс при нажатии', async () => {
      const mockedOnPress = jest.fn()
      const { getByTestId, getByText } = render(
        <TestComponent onPress={mockedOnPress} />
      )
      const user = userEvent.setup()

      layoutButtons(getByTestId)

      const animatedFrame = getByTestId('SelectButton_AnimatedFrame')
      await waitFor(() =>
        expect(animatedFrame).toHaveAnimatedStyle({ left: 0, width: 100 })
      )

      await user.press(getByText('Вторая кнопка'))

      expect(mockedOnPress).toHaveBeenCalledWith(1)

      await waitFor(() =>
        expect(animatedFrame).toHaveAnimatedStyle({ left: 100, width: 100 })
      )
    })
  })

  describe('управляемый режим', () => {
    test('ожидает обновления selectedIndex после нажатия', async () => {
      const mockedOnPress = jest.fn()
      const { getByRole, getByTestId, rerender } = render(
        <TestComponent selectedIndex={0} onPress={mockedOnPress} />
      )
      const user = userEvent.setup()

      layoutButtons(getByTestId)

      const animatedFrame = getByTestId('SelectButton_AnimatedFrame')
      await waitFor(() =>
        expect(animatedFrame).toHaveAnimatedStyle({ left: 0, width: 100 })
      )
      await waitFor(() => {
        expect(
          getByRole('button', { name: 'Первая кнопка', selected: true })
        ).toBeDefined()
        expect(
          getByRole('button', { name: 'Вторая кнопка', selected: false })
        ).toBeDefined()
      })

      const secondButton = getByRole('button', { name: 'Вторая кнопка' })

      await user.press(secondButton)

      expect(mockedOnPress).toHaveBeenCalledWith(1)
      expect(animatedFrame).toHaveAnimatedStyle({ left: 0, width: 100 })
      expect(
        getByRole('button', { name: 'Первая кнопка', selected: true })
      ).toBeDefined()
      expect(
        getByRole('button', { name: 'Вторая кнопка', selected: false })
      ).toBeDefined()

      rerender(<TestComponent selectedIndex={1} onPress={mockedOnPress} />)

      await waitFor(() => {
        expect(animatedFrame).toHaveAnimatedStyle({ left: 100, width: 100 })
        expect(
          getByRole('button', { name: 'Первая кнопка', selected: false })
        ).toBeDefined()
        expect(
          getByRole('button', { name: 'Вторая кнопка', selected: true })
        ).toBeDefined()
      })
    })
  })

  describe('анимированный режим', () => {
    test('сохраняет приоритет position над initialIndex из старого API', async () => {
      const { getByTestId } = render(<AnimatedTestComponent initialIndex={1} />)

      layoutButtons(getByTestId)

      await waitFor(() =>
        expect(getByTestId('SelectButton_AnimatedFrame')).toHaveAnimatedStyle({
          left: 0,
          width: 100,
        })
      )
    })

    test('изменяет позицию только через внешний SharedValue', async () => {
      const mockedOnPress = jest.fn()
      const { getByTestId, getByText } = render(
        <AnimatedTestComponent onPress={mockedOnPress} />
      )
      const user = userEvent.setup()

      layoutButtons(getByTestId)

      const animatedFrame = getByTestId('SelectButton_AnimatedFrame')

      await user.press(getByText('Вторая кнопка'))

      expect(mockedOnPress).toHaveBeenCalledWith(1)

      await waitFor(() =>
        expect(animatedFrame).toHaveAnimatedStyle({ left: 0, width: 100 })
      )

      await user.press(getByTestId('ChangePosition'))

      await waitFor(() =>
        expect(animatedFrame).toHaveAnimatedStyle({ left: 50, width: 100 })
      )
    })
  })
})
