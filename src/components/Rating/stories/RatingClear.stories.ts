import type { Meta, StoryObj } from '@storybook/react'

import { RatingClear } from '../RatingClear'

const meta: Meta<typeof RatingClear> = {
  title: 'Rating/RatingClear',
  component: RatingClear,
  args: {
    disabled: false,
    paddings: false,
  },
  argTypes: {
    onPress: { action: 'onPress' },
  },
  parameters: {
    notes: `
      Компонент элемента рейтинга. Предоставляет функционал очистки рейтинга.
      Используется компонентом Rating

      <RatingClear
        disabled={disabled}
        paddings={paddings}
        onPress={onClear}
      />
    `,
  },
}

export default meta

type Story = StoryObj<typeof RatingClear>

const RatingClearStory: Story = {}

export { RatingClearStory as RatingClear }
