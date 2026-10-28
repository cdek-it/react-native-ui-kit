import type { Meta, StoryObj } from '@storybook/react'

import { inputDocumentationNotes } from '../../../../.storybook/inputDocumentation'

import { InputCaption } from './InputCaption'

const meta: Meta<typeof InputCaption> = {
  title: 'Form Input/InputCaption',
  tags: ['version:2.0', 'design:pending'],
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
  parameters: {
    notes: inputDocumentationNotes.InputCaption,
    controls: { include: ['children', 'variant', 'showIcon'] },
  },
  render: (args) => <InputCaption {...args} />,
}

export default meta

type Story = StoryObj<typeof meta>

const InputCaptionStory: Story = { name: 'InputCaption' }

export { InputCaptionStory as InputCaption }
