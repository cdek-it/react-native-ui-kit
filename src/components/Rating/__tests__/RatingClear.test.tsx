import { render } from '@testing-library/react-native'

import { RatingClear, type RatingClearProps } from '../RatingClear'

describe('RatingItem component tests', () => {
  const ratingItemSnapshotCases = generatePropsCombinations<RatingClearProps>({
    disabled: [true, false],
    testOnly_pressed: [true, false],
    paddings: [true, false],
  })

  test.each(ratingItemSnapshotCases)(
    'checked - $checked, disabled - $disabled, pressed - $testOnly_pressed, paddings - $paddings',
    (props) => {
      const renderRatingItem = render(<RatingClear {...props} />)

      expect(renderRatingItem.toJSON()).toMatchSnapshot()
    }
  )
})
