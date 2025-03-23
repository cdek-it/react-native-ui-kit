import { render, userEvent } from '@testing-library/react-native'

import { RatingItem, type RatingItemProps } from '../RatingItem'

describe('RatingItem component tests', () => {
  const ratingItemSnapshotCases = generatePropsCombinations<RatingItemProps>({
    checked: [true, false],
    disabled: [true, false],
    testOnly_pressed: [true, false],
    paddings: [true, false],
  })

  test.each(ratingItemSnapshotCases)(
    'checked - $checked, disabled - $disabled, pressed - $testOnly_pressed, paddings - $paddings',
    (props) => {
      const renderRatingItem = render(<RatingItem {...props} />)

      expect(renderRatingItem.toJSON()).toMatchSnapshot()
    }
  )

  test('Handle press', async () => {
    const mockedOnPress = jest.fn()

    const { getByTestId } = render(
      <RatingItem checked={false} testID='RatingItem' onPress={mockedOnPress} />
    )
    const pressableContainer = getByTestId('RatingItem')
    const user = userEvent.setup()

    expect(mockedOnPress).not.toHaveBeenCalled()

    await user.press(pressableContainer)

    expect(mockedOnPress).toHaveBeenCalled()
  })
})
