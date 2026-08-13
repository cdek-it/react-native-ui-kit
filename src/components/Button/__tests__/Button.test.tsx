import { IconArrowDownRight } from '@tabler/icons-react-native'
import { render, userEvent } from '@testing-library/react-native'

import { Button } from '../Button'

describe('Button', () => {
  test.each(['small', 'base', 'large', 'xlarge'] as const)(
    'отображает текст для размера %s',
    (size) => {
      const { getByText } = render(<Button label='Button' size={size} />)

      expect(getByText('Button')).toBeOnTheScreen()
    }
  )

  test.each(['prefix', 'postfix'] as const)(
    'отображает иконку в позиции %s',
    (iconPosition) => {
      const { getAllByTestId } = render(
        <Button
          Icon={IconArrowDownRight}
          iconPosition={iconPosition}
          label='Button'
        />
      )

      expect(getAllByTestId('Button_Icon')).not.toHaveLength(0)
    }
  )

  test('скрывает текст в режиме iconOnly', () => {
    const { getAllByTestId, queryByTestId } = render(
      <Button iconOnly Icon={IconArrowDownRight} />
    )

    expect(getAllByTestId('Button_Icon')).not.toHaveLength(0)
    expect(queryByTestId('Button_Text')).not.toBeOnTheScreen()
  })

  test('показывает индикатор загрузки вместо иконки', () => {
    const { getByTestId, queryByTestId } = render(
      <Button loading Icon={IconArrowDownRight} label='Button' />
    )

    expect(getByTestId('Button_ActivityIndicator')).toBeOnTheScreen()
    expect(queryByTestId('Button_Icon')).not.toBeOnTheScreen()
  })

  test('вызывает onPress для доступной кнопки', async () => {
    const onPress = jest.fn()
    const user = userEvent.setup()
    const { getByRole } = render(<Button label='Button' onPress={onPress} />)

    await user.press(getByRole('button'))

    expect(onPress).toHaveBeenCalledOnce()
  })

  test.each([{ disabled: true }, { loading: true }])(
    'не вызывает onPress, если кнопка недоступна: %o',
    async (state) => {
      const onPress = jest.fn()
      const user = userEvent.setup()
      const { getByRole } = render(
        <Button label='Button' onPress={onPress} {...state} />
      )

      await user.press(getByRole('button'))

      expect(onPress).not.toHaveBeenCalled()
    }
  )
})
