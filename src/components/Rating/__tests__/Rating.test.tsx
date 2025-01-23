import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { Rating, type RatingProps } from '../Rating'

const mockOnChange = jest.fn()
const mockOnClear = jest.fn()

const props: Pick<RatingProps, 'rating' | 'onChange' | 'onClear'> = {
  rating: 3,
  onChange: mockOnChange,
  onClear: mockOnClear,
}

describe('Rating component tests', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with default props', () => {
    const renderedRating = render(<Rating {...props} />)
    const ratingItems = renderedRating.getAllByTestId(/RatingItem-/)
    expect(ratingItems).toHaveLength(5) // значение 5 - дефолтное в компоненте Rating
    expect(renderedRating.toJSON()).toMatchSnapshot()
  })

  it.each([3, 4])('renders the correct number of checked items - $rating', (rating) => {
    const renderedRating = render(<Rating {...props} rating={rating} />)
    expect(renderedRating.toJSON()).toMatchSnapshot()
  })

  it('calls onChange when a rating item is pressed', () => {
    const { getByTestId } = render(<Rating {...props} />)
    const ratingItem = getByTestId('RatingItem-4') // Index 3 corresponds to rating 4
    fireEvent.press(ratingItem)
    expect(mockOnChange).toHaveBeenCalledWith(4)
  })

  it('calls onClear when the clear button is pressed', () => {
    const { getByTestId } = render(<Rating {...props} />)
    const clearButton = getByTestId('RatingClear')
    fireEvent.press(clearButton)
    expect(mockOnClear).toHaveBeenCalled()
  })

  it('renders correctly with a different maxRating', () => {
    const { getAllByTestId } = render(<Rating {...props} maxRating={7} />)
    const ratingItems = getAllByTestId(/RatingItem-/)
    expect(ratingItems).toHaveLength(7)
  })
})
