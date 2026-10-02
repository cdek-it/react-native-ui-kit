import { IconArrowDownRight } from '@tabler/icons-react-native'
import { fireEvent, render, userEvent } from '@testing-library/react-native'
import type { PressableProps } from 'react-native'

import { Button } from '../Button'
import { ButtonSeverity } from '../ButtonSeverity'
import type { ButtonIconPosition } from '../types'

type InteractionProps = PressableProps & {
  loading?: boolean
  iconPosition?: ButtonIconPosition
}

describe.each([
  {
    name: 'Button',
    createButton: (props: InteractionProps) => (
      <Button Icon={IconArrowDownRight} label='Сохранить' {...props} />
    ),
  },
  {
    name: 'ButtonSeverity',
    createButton: (props: InteractionProps) => (
      <ButtonSeverity
        Icon={IconArrowDownRight}
        label='Сохранить'
        severity='danger'
        {...props}
      />
    ),
  },
])('$name interactions', ({ createButton }) => {
  test.each([
    { name: 'default', disabled: false, loading: false },
    { name: 'disabled', disabled: true, loading: false },
    { name: 'loading', disabled: false, loading: true },
    { name: 'loading + disabled', disabled: true, loading: true },
  ])(
    'сохраняет accessibilityState и доступность нажатия: $name',
    async ({ disabled, loading }) => {
      const onPress = jest.fn()
      const { getByRole } = render(
        createButton({
          disabled,
          loading,
          onPress,
          accessibilityState: {
            selected: true,
            expanded: false,
            checked: 'mixed',
            disabled: false,
            busy: false,
          },
        })
      )
      const button = getByRole('button', { name: 'Сохранить' })

      expect(button.props.accessibilityState).toStrictEqual({
        selected: true,
        expanded: false,
        checked: 'mixed',
        disabled: disabled || loading,
        busy: loading,
      })

      await userEvent.setup().press(button)

      expect(onPress).toHaveBeenCalledTimes(disabled || loading ? 0 : 1)
    }
  )

  test.each(['prefix', 'postfix'] as const)(
    'показывает один нефокусируемый индикатор при loading + disabled в позиции %s',
    (iconPosition) => {
      const { getByTestId, queryByTestId, getByText } = render(
        createButton({ loading: true, disabled: true, iconPosition })
      )
      const indicator = getByTestId('Button_ActivityIndicator', {
        includeHiddenElements: true,
      })

      expect(indicator.props.accessible).toBeFalse()
      expect(indicator.props.accessibilityElementsHidden).toBeTrue()
      expect(indicator.props.importantForAccessibility).toBe(
        'no-hide-descendants'
      )
      expect(queryByTestId('Button_Icon')).not.toBeOnTheScreen()
      expect(getByText('Сохранить')).toBeOnTheScreen()
    }
  )

  test('использует переданное доступное имя и роль', () => {
    const { getByRole } = render(
      createButton({
        accessibilityLabel: 'Отправить изменения',
        accessibilityRole: 'link',
      })
    )

    expect(getByRole('link', { name: 'Отправить изменения' })).toBeOnTheScreen()
  })

  test('передаёт события onPressIn и onPressOut', async () => {
    const onPressIn = jest.fn()
    const onPressOut = jest.fn()
    const { getByRole } = render(createButton({ onPressIn, onPressOut }))
    await userEvent.setup().press(getByRole('button'))

    expect(onPressIn).toHaveBeenCalledOnce()
    expect(onPressOut).toHaveBeenCalledOnce()
    expect(onPressIn).toHaveBeenCalledWith(
      expect.objectContaining({ nativeEvent: expect.any(Object) })
    )
    expect(onPressOut).toHaveBeenCalledWith(
      expect.objectContaining({ nativeEvent: expect.any(Object) })
    )
  })

  test('изменяет состояние загрузки только после обновления пропсов', async () => {
    const onPress = jest.fn()
    const user = userEvent.setup()
    const { getByRole, queryByTestId, rerender } = render(
      createButton({ onPress })
    )
    await user.press(getByRole('button'))

    expect(
      queryByTestId('Button_ActivityIndicator', { includeHiddenElements: true })
    ).not.toBeOnTheScreen()

    rerender(createButton({ onPress, loading: true, disabled: true }))

    expect(getByRole('button').props.accessibilityState).toMatchObject({
      disabled: true,
      busy: true,
    })

    await user.press(getByRole('button'))

    expect(onPress).toHaveBeenCalledOnce()

    rerender(createButton({ onPress }))

    expect(
      queryByTestId('Button_ActivityIndicator', { includeHiddenElements: true })
    ).not.toBeOnTheScreen()

    await user.press(getByRole('button'))

    expect(onPress).toHaveBeenCalledTimes(2)
  })

  test.each([
    { name: 'не задан', hitSlop: undefined },
    { name: 'число', hitSlop: 12 },
    { name: 'отступы по сторонам', hitSlop: { top: 20, right: 4 } },
  ])('передаёт hitSlop без изменений: $name', ({ hitSlop }) => {
    const { getByRole } = render(createButton({ hitSlop }))

    expect(getByRole('button').props.hitSlop).toBe(hitSlop)
  })

  test('передаёт исходное событие onLayout', () => {
    const onLayout = jest.fn()
    const { getByRole } = render(createButton({ onLayout }))
    const event = {
      nativeEvent: { layout: { x: 0, y: 0, width: 28, height: 28 } },
    }

    fireEvent(getByRole('button'), 'layout', event)

    expect(onLayout).toHaveBeenCalledOnce()
    expect(onLayout).toHaveBeenCalledWith(event)
  })

  test('передаёт состояние нажатия в пользовательскую функцию style', async () => {
    const style = jest.fn(() => ({ opacity: 1 }))
    const { getByRole } = render(createButton({ style }))
    await userEvent.setup().press(getByRole('button'))

    expect(style).toHaveBeenCalledWith({ pressed: true })
    expect(style).toHaveBeenLastCalledWith({ pressed: false })
  })

  test('блокирует нажатие при включении загрузки во время pressIn', async () => {
    const onPress = jest.fn()
    const onPressOut = jest.fn()
    const onPressIn = jest.fn(() => {
      rerender(createButton({ onPress, onPressOut, loading: true }))
    })
    const { getByRole, getByTestId, rerender } = render(
      createButton({ onPress, onPressIn, onPressOut })
    )
    await userEvent.setup().press(getByRole('button'))

    expect(onPressIn).toHaveBeenCalledOnce()
    expect(onPress).not.toHaveBeenCalled()
    expect(
      getByTestId('Button_ActivityIndicator', { includeHiddenElements: true })
    ).toBeOnTheScreen()

    rerender(createButton({ onPress, onPressIn: undefined, onPressOut }))
    await userEvent.setup().press(getByRole('button'))

    expect(onPress).toHaveBeenCalledOnce()
  })
})
