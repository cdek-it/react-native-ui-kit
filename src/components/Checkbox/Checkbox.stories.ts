import type { Meta, StoryObj } from '@storybook/react'

import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Checkbox',
  component: Checkbox,
  args: {
    checked: false,
    indeterminate: false,
    disabled: false,
    state: 'default',
  },
  argTypes: { state: { control: 'radio', options: ['default', 'danger'] } },
}

export default meta

type Story = StoryObj<typeof Checkbox>

const CheckboxStory: Story = {}

export { CheckboxStory as Checkbox }
