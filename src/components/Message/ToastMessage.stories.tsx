import type { Meta, StoryObj } from '@storybook/react'
import { IconUserCircle } from '@tabler/icons-react-native'
import { useState } from 'react'
import { View } from 'react-native'
import { action } from 'storybook/actions'

import { Button } from '../Button'
import { Body } from '../Typography'

import { ToastMessage, type ToastMessageProps } from './ToastMessage'

type StoryArgs = Omit<ToastMessageProps, 'body' | 'footer'> & {
  readonly body: string
  readonly footer: string
  readonly withClose: boolean
  readonly width: number
}

const icons = { default: undefined, IconUserCircle }

const Example = ({ body, footer, withClose, width, ...args }: StoryArgs) => {
  const [attempt, setAttempt] = useState(0)

  return (
    <View style={{ gap: 14 }}>
      <ToastMessage
        {...args}
        body={body ? <Body size='base'>{body}</Body> : undefined}
        footer={
          footer ? (
            <Button label={footer} onPress={action('footer')} />
          ) : undefined
        }
        key={attempt}
        style={[args.style, width > 0 && { width }]}
        onClose={withClose ? args.onClose : undefined}
      />
      {args.timerValue ? (
        <Button
          label='Перезапустить таймер'
          onPress={() => setAttempt((value) => value + 1)}
        />
      ) : null}
    </View>
  )
}

const meta = {
  title: 'Message/ToastMessage',
  component: ToastMessage,
  args: {
    title: 'Уведомление',
    caption: 'Подробности сообщения',
    severity: 'info',
    hiddenIcon: false,
    body: '',
    footer: '',
    closeLabel: '',
    closeAccessibilityLabel: '',
    timerValue: 0,
    withClose: true,
    width: 0,
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
    Icon: { control: 'radio', options: Object.keys(icons), mapping: icons },
    hiddenIcon: { control: 'boolean' },
    body: {
      control: 'text',
      description: 'Текст body. Пустое значение скрывает ноду.',
    },
    footer: {
      control: 'text',
      description: 'Текст кнопки в footer. Пустое значение скрывает ноду.',
    },
    withClose: {
      control: 'boolean',
      description:
        'Настройка истории: передавать onClose и показывать действие закрытия.',
    },
    closeLabel: { control: 'text' },
    closeAccessibilityLabel: { control: 'text' },
    timerValue: {
      control: { type: 'number', min: 0, max: 99 },
      description: 'Секунды. 0 отключает таймер.',
    },
    width: {
      control: { type: 'number', min: 0, max: 600 },
      description: 'Настройка истории: ширина в style. 0 — на всю ширину.',
    },
  },
  parameters: {
    controls: {
      include: [
        'theme',
        'title',
        'caption',
        'severity',
        'Icon',
        'hiddenIcon',
        'body',
        'footer',
        'withClose',
        'closeLabel',
        'closeAccessibilityLabel',
        'timerValue',
        'width',
      ],
    },
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<StoryArgs>

export default meta

type Story = StoryObj<typeof meta>

const ToastMessageStory: Story = { name: 'ToastMessage' }

export { ToastMessageStory as ToastMessage }
