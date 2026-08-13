import type { Meta, StoryObj } from '@storybook/react'
import { createElement } from 'react'
import { StyleSheet, View } from 'react-native'

import { Body } from '../Typography'

import { Badge, type BadgeProps } from './Badge'

const styles = StyleSheet.create({
  container: { gap: 16 },
  example: { gap: 8 },
})

const meta: Meta<typeof Badge> = {
  title: 'Misc/Badge',
  component: Badge,
  args: { children: 'Badge', severity: 'basic', size: 'base' },
  argTypes: {
    children: { control: 'text' },
    severity: {
      control: 'radio',
      options: ['basic', 'info', 'success', 'warning', 'danger'],
    },
    size: { control: 'radio', options: ['base', 'large', 'xlarge'] },
  },
  parameters: { controls: { exclude: ['dot'] } },
  render: ({ children = 'Badge', severity, size }) => {
    const textBadgeProps: BadgeProps = { children, dot: false, severity, size }

    return createElement(
      View,
      { style: styles.container },
      createElement(
        View,
        { style: styles.example },
        createElement(Body, null, 'Severity'),
        createElement(Badge, textBadgeProps)
      ),
      createElement(
        View,
        { style: styles.example },
        createElement(Body, null, 'Dot'),
        createElement(Badge, { dot: true, severity, size })
      )
    )
  },
}

export default meta

type Story = StoryObj<typeof Badge>

const BadgeStory: Story = {}

export { BadgeStory as Badge }
