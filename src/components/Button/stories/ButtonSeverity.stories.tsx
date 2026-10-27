import type { Meta, StoryObj } from '@storybook/react'
import {
  IconArrowDownRight,
  IconArrowDownLeft,
} from '@tabler/icons-react-native'
import { StyleSheet, View } from 'react-native'

import { Body } from '../../Typography'

import { ButtonSeverity } from '../ButtonSeverity'
import type {
  ButtonProps,
  ButtonSeverityProps,
  ButtonSeverityVariant,
} from '../types'

import {
  badgeArgs,
  badgeArgTypes,
  createBadge,
  type BadgeStoryArgs,
} from './badgeControls'

type StoryArgs = ButtonProps<ButtonSeverityVariant> &
  ButtonSeverityProps &
  BadgeStoryArgs

const Icons = { IconArrowDownRight, IconArrowDownLeft, undefined }
const styles = StyleSheet.create({
  container: { gap: 16 },
  example: { gap: 8 },
})

const meta: Meta<StoryArgs> = {
  title: 'Button/ButtonSeverity',
  tags: ['version:2.0'],
  component: ButtonSeverity,
  args: {
    size: 'base',
    rounded: false,
    appearance: 'filled',
    label: 'Button',
    loading: false,
    disabled: false,
    ...badgeArgs,
    iconPosition: 'prefix',
    severity: 'info',
  },
  argTypes: {
    size: { control: 'radio', options: ['small', 'base', 'large', 'xlarge'] },
    rounded: { control: 'boolean' },
    appearance: { control: 'radio', options: ['filled', 'outlined', 'text'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconPosition: { control: 'radio', options: ['prefix', 'postfix'] },
    ...badgeArgTypes,
    onPress: { action: 'OnPress' },
    severity: {
      control: 'radio',
      options: ['info', 'success', 'warning', 'danger'],
    },
    Icon: { control: 'select', options: Object.keys(Icons), mapping: Icons },
  },
  parameters: {
    controls: { exclude: ['badge', 'iconOnly', 'shape', 'variant'] },
  },
  render: ({
    showBadge,
    'badge.dot': badgeDot,
    'badge.text': badgeText,
    'badge.size': badgeSize,
    'badge.severity': badgeSeverity,
    iconOnly: _iconOnly,
    Icon,
    iconPosition,
    label = 'Button',
    ...args
  }) => {
    const badge = createBadge({
      showBadge,
      'badge.dot': badgeDot,
      'badge.text': badgeText,
      'badge.size': badgeSize,
      'badge.severity': badgeSeverity,
    })
    const buttonProps: ButtonProps<ButtonSeverityVariant> &
      ButtonSeverityProps = { ...args, badge, Icon, iconPosition, label }
    const iconOnlyButtonProps: ButtonProps<ButtonSeverityVariant> &
      ButtonSeverityProps = {
      ...args,
      badge,
      iconOnly: true,
      accessibilityLabel: args.accessibilityLabel ?? label,
      Icon: Icon ?? IconArrowDownRight,
    }

    return (
      <View style={styles.container}>
        <View style={styles.example}>
          <Body>С текстом</Body>
          <ButtonSeverity {...buttonProps} />
        </View>
        <View style={styles.example}>
          <Body>Только иконка</Body>
          <ButtonSeverity {...iconOnlyButtonProps} />
        </View>
      </View>
    )
  },
}

export default meta

type Story = StoryObj<StoryArgs>

const ButtonStory: Story = { args: {}, argTypes: {} }

export { ButtonStory as ButtonSeverity }
