import type { Meta, StoryObj } from '@storybook/react'
import { IconUserCircle } from '@tabler/icons-react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { action } from 'storybook/actions'

import { Button } from '../Button'
import { Body } from '../Typography'

import { Message, type MessageProps } from './Message'

type StoryArgs = Omit<MessageProps, 'body' | 'footer'> & {
  readonly body: string
  readonly withFooter: boolean
  readonly withClose: boolean
}

const icons = { default: undefined, IconUserCircle }

const Example = ({ body, withFooter, withClose, ...args }: StoryArgs) => {
  const [attempt, setAttempt] = useState(0)

  return (
    <View style={{ gap: 14 }}>
      <Message
        {...args}
        body={body ? <Body size='base'>{body}</Body> : undefined}
        footer={
          withFooter ? (
            <>
              <Button
                label='Отмена'
                variant='secondary'
                onPress={action('footer.cancel')}
              />
              <Button label='Подробнее' onPress={action('footer.details')} />
            </>
          ) : undefined
        }
        key={attempt}
        onClose={withClose ? args.onClose : undefined}
      />
      {args.timerValue !== undefined && args.timerValue > 0 ? (
        <Button
          label='Перезапустить таймер'
          onPress={() => setAttempt((value) => value + 1)}
        />
      ) : null}
    </View>
  )
}

const meta = {
  title: 'Message/Message',
  component: Message,
  tags: ['version:2.0', 'design:pending'],
  args: {
    title: 'Заголовок сообщения',
    caption: 'Подробности сообщения',
    severity: 'info',
    timerValue: 0,
    Icon: undefined,
    hiddenIcon: false,
    body: '',
    withFooter: false,
    withClose: true,
    closeLabel: '',
    closeAccessibilityLabel: '',
    onClose: action('onClose'),
    onTimerFinish: action('onTimerFinish'),
  },
  argTypes: {
    title: { control: 'text' },
    caption: { control: 'text' },
    severity: {
      control: 'radio',
      options: ['info', 'success', 'warning', 'danger'],
    },
    timerValue: { control: { type: 'number', min: 0, max: 99 } },
    Icon: {
      control: 'radio',
      options: Object.keys(icons),
      mapping: icons,
      if: { arg: 'timerValue', eq: 0 },
    },
    hiddenIcon: { control: 'boolean', if: { arg: 'timerValue', eq: 0 } },
    body: { control: 'text' },
    withFooter: { control: 'boolean' },
    withClose: { control: 'boolean' },
    closeLabel: { control: 'text', if: { arg: 'withClose', truthy: true } },
    closeAccessibilityLabel: {
      control: 'text',
      if: { arg: 'withClose', truthy: true },
    },
  },
  parameters: {
    controls: {
      include: [
        'theme',
        'title',
        'caption',
        'severity',
        'timerValue',
        'Icon',
        'hiddenIcon',
        'body',
        'withFooter',
        'withClose',
        'closeLabel',
        'closeAccessibilityLabel',
      ],
    },
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

const MessageStory: Story = { name: 'Message' }

export { MessageStory as Message }
