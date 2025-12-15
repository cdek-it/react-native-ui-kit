import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import { useCallback, useEffect, useState } from 'react'

import { InputOtp } from './InputOtp'

const meta: Meta<typeof InputOtp> = {
  title: 'Form/InputOtp',
  component: InputOtp,
  args: { disabled: false, error: false, length: 4, value: '' },
  render: (args) => {
    const [, updateArgs] = useArgs()
    const [value, setValue] = useState(args.value)

    const onChange = useCallback(
      (nextValue: string) => {
        setValue(nextValue)
        updateArgs({ value: nextValue })
      },
      [updateArgs]
    )

    useEffect(() => {
      setValue(args.value)
    }, [args.value])

    return <InputOtp {...args} value={value} onChange={onChange} />
  },
}

export default meta

type Story = StoryObj<typeof InputOtp>

const InputOtpStory: Story = {}

export { InputOtpStory as InputOtp }
