import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import { RadioButton, type RadioButtonProps } from '../RadioButton'

const meta: Meta<RadioButtonProps> = {
  title: 'Form/RadioButton',
  tags: ['version:2.0'],
  component: RadioButton,
  args: {
    checked: false,
    disabled: false,
    danger: false,
    label: 'Курьером',
    caption: 'Привезём заказ по указанному адресу',
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    danger: { control: 'boolean' },
    label: { control: 'text' },
    caption: { control: 'text', if: { arg: 'label', truthy: true } },
    onPress: { action: 'onPress' },
  },
  parameters: {
    controls: {
      include: ['theme', 'checked', 'disabled', 'danger', 'label', 'caption'],
    },
  },
  render: ({ label, caption, ...args }) => {
    const [, updateArgs] = useArgs<RadioButtonProps>()

    return (
      <RadioButton
        {...args}
        accessibilityLabel={label ? undefined : 'Курьером'}
        caption={caption || undefined}
        label={label || undefined}
        onPress={(event) => {
          args.onPress?.(event)
          updateArgs({ checked: true })
        }}
      />
    )
  },
}

export default meta

type Story = StoryObj<RadioButtonProps>

const RadioButtonStory: Story = { name: 'RadioButton' }

export { RadioButtonStory as RadioButton }
