import type { Meta, StoryObj } from '@storybook/react'

import { ProgressBar } from './ProgressBar'

const meta: Meta<typeof ProgressBar> = {
  title: 'ProgressBar',
  component: ProgressBar,
  args: {
    showValue: false,
    value: 20,
    style: {
      height: 7,
    },
  },
  parameters: {
    notes: `
      Компонент ProgressBar

      <ProgressBar
        value={20}
        showValue={false}
        style={{ height: 10, width: 200 }}
      />
    `,
  },
}

export default meta

const ProgressBarStory: StoryObj<typeof ProgressBar> = {}

export { ProgressBarStory as ProgressBar }
