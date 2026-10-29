import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import { Checkbox, type CheckboxProps } from '../Checkbox'

const meta: Meta<CheckboxProps> = {
  title: 'Form/Checkbox',
  tags: ['version:2.0'],
  component: Checkbox,
  args: {
    checked: false,
    indeterminate: false,
    disabled: false,
    danger: false,
    label: 'Получать уведомления',
    caption: 'Сообщать об изменении статуса заказа',
  },
  argTypes: {
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    danger: { control: 'boolean' },
    label: { control: 'text' },
    caption: { control: 'text', if: { arg: 'label', truthy: true } },
    onCheckedChange: { action: 'onCheckedChange' },
    onPress: { action: 'onPress' },
  },
  parameters: {
    controls: {
      include: [
        'theme',
        'checked',
        'indeterminate',
        'disabled',
        'danger',
        'label',
        'caption',
      ],
    },
  },
  render: ({ label, caption, ...args }) => {
    const [, updateArgs] = useArgs<CheckboxProps>()

    return (
      <Checkbox
        {...args}
        accessibilityLabel={label ? undefined : 'Получать уведомления'}
        caption={caption || undefined}
        label={label || undefined}
        onCheckedChange={(checked) => {
          args.onCheckedChange?.(checked)
          updateArgs({ checked, indeterminate: false })
        }}
      />
    )
  },
}

export default meta

type Story = StoryObj<CheckboxProps>

const CheckboxStory: Story = {}

export { CheckboxStory as Checkbox }
