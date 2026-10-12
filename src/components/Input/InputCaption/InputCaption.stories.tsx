import type { Meta, StoryObj } from '@storybook/react'

import { InputCaption } from './InputCaption'

const meta: Meta<typeof InputCaption> = {
  title: 'Input/InputCaption',
  component: InputCaption,
  args: { children: 'Подсказка к полю', variant: 'base', showIcon: false },
  argTypes: {
    children: { control: 'text' },
    variant: {
      control: 'radio',
      options: ['base', 'success', 'warning', 'danger', 'info'],
    },
    showIcon: { control: 'boolean' },
  },
  parameters: { controls: { include: ['children', 'variant', 'showIcon'] } },
  render: (args) => <InputCaption {...args} />,
}

export default meta

type Story = StoryObj<typeof meta>

const InputCaptionStory: Story = { name: 'InputCaption' }

export { InputCaptionStory as InputCaption }
