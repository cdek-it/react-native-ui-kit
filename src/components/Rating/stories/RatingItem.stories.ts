import type { Meta, StoryObj } from '@storybook/react'

import { RatingItem } from '../RatingItem'

const meta: Meta<typeof RatingItem> = {
  title: 'Rating/RatingItem',
  component: RatingItem,
  args: { checked: false, disabled: false, paddings: false },
  argTypes: { onPress: { action: 'onPress' } },
  parameters: {
    notes: `
      Компонент элемента рейтинга. Предоставляет функционал отображения и обработки нажатий на "звёздочки"
      Используется компонентом Rating

      <RatingItem
        checked={checked}
        paddings={paddings}
        onPress={handleItemPress}
      />
    `,
  },
}

export default meta

type Story = StoryObj<typeof RatingItem>

const RatingItemStory: Story = {}

export { RatingItemStory as RatingItem }
