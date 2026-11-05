import { render, userEvent } from '@testing-library/react-native'

import { LegacyInputGroupAddon } from '../LegacyInputGroupAddon'

describe('LegacyInputGroupAddon', () => {
  test.each([
    { name: 'активен', disabled: false, calls: 1 },
    { name: 'отключён', disabled: true, calls: 0 },
  ])('обрабатывает нажатие, когда аддон $name', async ({ disabled, calls }) => {
    const user = userEvent.setup()
    const onPress = jest.fn()
    const { getByTestId, getByText } = render(
      <LegacyInputGroupAddon
        content='Дополнение'
        disabled={disabled}
        position='left'
        onPress={onPress}
      />
    )

    expect(getByText('Дополнение')).toBeOnTheScreen()

    await user.press(getByTestId('InputGroupAddon_Pressable'))

    expect(onPress).toHaveBeenCalledTimes(calls)
  })
})
