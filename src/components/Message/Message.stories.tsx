import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import { IconUserCircle } from '@tabler/icons-react-native'

import { View } from 'react-native'

import { Body } from '../Typography'

import { Message } from './Message'

const icons = { IconUserCircle, default: undefined }

const Stub = ({ children }: { readonly children: string }) => (
  <View
    style={{
      padding: 14,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
    }}
  >
    <Body>{children}</Body>
  </View>
)

const meta: Meta<typeof Message> = {
  title: 'Message',
  args: {
    title: 'Message',
    caption: 'caption',
    severity: 'info',
    timerValue: undefined,
    hiddenIcon: false,
  },
  argTypes: {
    severity: {
      control: 'radio',
      options: ['info', 'success', 'warning', 'danger'],
    },
    Icon: { control: 'radio', options: Object.keys(icons), mapping: icons },
    onTimerFinish: { action: 'onTimerFinish' },
  },
  render: (args) => (
    <View style={{ gap: 10 }}>
      <Message {...args} />
      <Message {...args} body={<Stub>body</Stub>} onClose={action('onClose')} />
      <Message {...args} footer={<Stub>footer</Stub>} />
      <Message
        {...args}
        body={<Stub>body</Stub>}
        footer={<Stub>footer</Stub>}
        timerValue={12}
      />
    </View>
  ),
}

export default meta

type Story = StoryObj<typeof Message>

const MessageStory: Story = {}

export { MessageStory as Message }
