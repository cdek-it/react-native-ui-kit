import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import React, { useCallback } from 'react'

import { Rating } from '../Rating'

const meta: Meta<typeof Rating> = {
  title: 'Rating/Rating',
  args: {
    disabled: false,
    paddings: false,
    maxRating: 5,
  },
  argTypes: {
    rating: { control: 'number' },
  },
  parameters: {
    notes: `
      #### Элемент рейтинга
      const [rating, setRating] = useState(0)

      const onChange = (r: number) => {
        setRating(r)
      }

      const onClear = () => {
        setRating(0)
      }

      return (
        <Rating
          disabled={false}
          paddings={false}
          maxRating={5}
          rating={rating}
          onChange={onChange}
          onClear={onClear}
        />
      )
  `,
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const onChange = useCallback(
      (rating: number) => {
        updateArgs({ rating })
      },
      [updateArgs]
    )

    const onClear = useCallback(() => {
      updateArgs({ rating: 0 })
    }, [updateArgs])

    return <Rating {...args} onChange={onChange} onClear={onClear} />
  },
}

export default meta

type Story = StoryObj<typeof Rating>

const RatingStory: Story = {}

export { RatingStory as Rating }
