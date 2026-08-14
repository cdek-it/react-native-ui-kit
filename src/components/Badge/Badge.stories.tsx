import type { Meta, StoryObj } from '@storybook/react'
import { StyleSheet, View } from 'react-native'

import { Body } from '../Typography'

import { Badge } from './Badge'

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
  render: ({ children = 'Badge', severity, size }) => (
    <View style={styles.container}>
      <View style={styles.example}>
        <Body>Severity</Body>
        <Badge severity={severity} size={size}>
          {children}
        </Badge>
      </View>
      <View style={styles.example}>
        <Body>Dot</Body>
        <Badge dot severity={severity} size={size} />
      </View>
    </View>
  ),
}

export default meta

type Story = StoryObj<typeof Badge>

const BadgeStory: Story = {}

export { BadgeStory as Badge }
