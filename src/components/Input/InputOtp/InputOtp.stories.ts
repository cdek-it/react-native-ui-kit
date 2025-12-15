import type { Meta, StoryObj } from '@storybook/react'

import { InputOtp } from './InputOtp'

const meta: Meta<typeof InputOtp> = {
  title: 'Form/InputOtp',
  component: InputOtp,
  args: { disabled: false, error: false, length: 4 },
  argTypes: { onComplete: { action: 'onComplete' } },
}

export default meta

type Story = StoryObj<typeof InputOtp>

const InputOtpStory: Story = {}

export { InputOtpStory as InputOtp }
