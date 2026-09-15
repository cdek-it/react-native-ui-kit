import type { Meta, StoryObj } from '@storybook/react'
import {
  IconArrowDownRight,
  IconArrowDownLeft,
} from '@tabler/icons-react-native'
import { StyleSheet, View } from 'react-native'

import { Body } from '../Typography'

import { ButtonBadge } from './ButtonBadge'
import type { ButtonBadgeProps, ButtonBaseVariant, ButtonProps } from './types'

const Icons = { IconArrowDownRight, IconArrowDownLeft, undefined }
const styles = StyleSheet.create({
  container: { gap: 16 },
  example: { gap: 8 },
})

const meta: Meta<typeof ButtonBadge> = {
  title: 'Button/Badge',
  component: ButtonBadge,
  args: {
    size: 'base',
    shape: 'square',
    variant: 'primary',
    label: 'Button',
    loading: false,
    disabled: false,
    iconPosition: 'prefix',
    badgeSeverity: 'basic',
    badgeLabel: 'Badge',
  },
  argTypes: {
    size: { control: 'radio', options: ['small', 'base', 'large', 'xlarge'] },
    shape: { control: 'radio', options: ['square', 'circle'] },
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'tertiary', 'text', 'link'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconPosition: { control: 'radio', options: ['prefix', 'postfix'] },
    onPress: { action: 'onPress' },
    badgeSeverity: {
      control: 'radio',
      options: ['basic', 'info', 'success', 'warning', 'danger'],
    },
    Icon: { control: 'select', options: Object.keys(Icons), mapping: Icons },
  },
  parameters: { controls: { exclude: ['iconOnly'] } },
  render: ({
    iconOnly: _iconOnly,
    Icon,
    iconPosition,
    label = 'Button',
    ...args
  }) => {
    const buttonProps: ButtonProps<ButtonBaseVariant> & ButtonBadgeProps = {
      ...args,
      Icon,
      iconPosition,
      label,
    }
    const iconOnlyButtonProps: ButtonProps<ButtonBaseVariant> &
      ButtonBadgeProps = {
      ...args,
      iconOnly: true,
      Icon: Icon ?? IconArrowDownRight,
    }

    return (
      <View style={styles.container}>
        <View style={styles.example}>
          <Body>С текстом</Body>
          <ButtonBadge {...buttonProps} />
        </View>
        <View style={styles.example}>
          <Body>Только иконка</Body>
          <ButtonBadge {...iconOnlyButtonProps} />
        </View>
      </View>
    )
  },
}

export default meta

type Story = StoryObj<typeof ButtonBadge>

const ButtonStory: Story = { args: {}, argTypes: {} }

export { ButtonStory as Badge }
