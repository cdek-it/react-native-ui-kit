import type { Meta, StoryObj } from '@storybook/react'

import { RadioButton } from './RadioButton'

const meta: Meta<typeof RadioButton> = {
  title: 'RadioButton',
  component: RadioButton,
  args: { checked: false, disabled: false, state: 'default' },
  argTypes: { state: { control: 'radio', options: ['default', 'danger'] } },
}

export default meta

type Story = StoryObj<typeof RadioButton>

const RadioButtonStory: Story = { args: {} }
export { RadioButtonStory as RadioButton }
