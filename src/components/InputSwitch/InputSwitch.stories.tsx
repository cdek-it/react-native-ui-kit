import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { useCallback } from 'react'

import { InputSwitch } from './InputSwitch'

const meta: Meta<typeof InputSwitch> = {
  title: 'Legacy/InputSwitch',
  tags: ['deprecated'],
  component: InputSwitch,
  args: { disabled: false, danger: false, checked: false },
  argTypes: {
    disabled: { control: 'boolean' },
    danger: { control: 'boolean' },
    checked: { control: 'boolean' },
    onCheckedChange: { action: 'onCheckedChange', control: false },
  },
  render: (args) => {
    const { onCheckedChange: onCheckedChangeAction } = args
    const [, updateArgs] = useArgs()

    const onCheckedChange = useCallback(
      (nextValue: boolean) => {
        updateArgs({ checked: nextValue })
        onCheckedChangeAction?.(nextValue)
      },
      [onCheckedChangeAction, updateArgs]
    )

    return <InputSwitch {...args} onCheckedChange={onCheckedChange} />
  },
}

export default meta

type Story = StoryObj<typeof InputSwitch>

const InputSwitchStory: Story = { name: 'InputSwitch' }

export { InputSwitchStory as InputSwitch }
