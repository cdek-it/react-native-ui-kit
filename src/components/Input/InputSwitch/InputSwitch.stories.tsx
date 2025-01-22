import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import React, { useCallback } from 'react'

import { InputSwitch } from './InputSwitch'

const meta: Meta<typeof InputSwitch> = {
  title: 'Input/InputSwitch',
  args: {
    disabled: false,
    danger: false,
    checked: false,
  },
  argTypes: {
    onCheckedChange: { action: 'onCheckedChange' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const onCheckedChange = useCallback(
      (nextValue: boolean) => updateArgs({ checked: nextValue }),
      [updateArgs]
    )

    return <InputSwitch {...args} onCheckedChange={onCheckedChange} />
  },
}

export default meta

type Story = StoryObj<typeof InputSwitch>

const InputSwitchStory: Story = {}

export { InputSwitchStory as InputSwitch }
