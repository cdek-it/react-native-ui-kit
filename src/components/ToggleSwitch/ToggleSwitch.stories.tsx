import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import { ToggleSwitch } from './ToggleSwitch'
import type { ToggleSwitchProps } from './types'

const meta: Meta<ToggleSwitchProps> = {
  title: 'Form/ToggleSwitch',
  tags: ['version:2.0', 'design:pending'],
  component: ToggleSwitch,
  args: {
    checked: false,
    disabled: false,
    danger: false,
    label: 'Уведомления',
    caption: 'Сообщать об изменении статуса заказа',
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    danger: { control: 'boolean' },
    label: { control: 'text' },
    caption: { control: 'text' },
    onCheckedChange: { action: 'onCheckedChange' },
  },
  parameters: {
    controls: {
      include: ['theme', 'checked', 'disabled', 'danger', 'label', 'caption'],
    },
  },
  render: ({ label, caption, ...args }) => {
    const [, updateArgs] = useArgs<ToggleSwitchProps>()

    return (
      <ToggleSwitch
        {...args}
        accessibilityLabel={label ? undefined : 'Уведомления'}
        caption={caption || undefined}
        label={label || undefined}
        onCheckedChange={(checked) => {
          args.onCheckedChange?.(checked)
          updateArgs({ checked })
        }}
      />
    )
  },
}

export default meta

type Story = StoryObj<ToggleSwitchProps>

const ToggleSwitchStory: Story = {}

export { ToggleSwitchStory as ToggleSwitch }
