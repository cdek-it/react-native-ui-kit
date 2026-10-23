import type { Meta, StoryObj } from '@storybook/react'
import {
  IconArrowDownRight,
  IconArrowDownLeft,
} from '@tabler/icons-react-native'
import { StyleSheet, View } from 'react-native'

import { Body } from '../../Typography'

import { Button } from '../Button'
import type { ButtonBaseVariant, ButtonProps } from '../types'

import {
  badgeArgs,
  badgeArgTypes,
  createBadge,
  type BadgeStoryArgs,
} from './badgeControls'

type StoryArgs = ButtonProps<ButtonBaseVariant> & BadgeStoryArgs

const Icons = { IconArrowDownRight, IconArrowDownLeft, undefined }
const styles = StyleSheet.create({
  container: { gap: 16 },
  example: { gap: 8 },
})

const meta: Meta<StoryArgs> = {
  title: 'Button/Button',
  component: Button,
  args: {
    size: 'base',
    rounded: false,
    variant: 'primary',
    label: 'Button',
    loading: false,
    disabled: false,
    ...badgeArgs,
    iconPosition: 'prefix',
  },
  argTypes: {
    size: { control: 'radio', options: ['small', 'base', 'large', 'xlarge'] },
    rounded: { control: 'boolean' },
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'tertiary', 'text', 'link'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconPosition: { control: 'radio', options: ['prefix', 'postfix'] },
    ...badgeArgTypes,
    onPress: { action: 'OnPress' },
    Icon: { control: 'select', options: Object.keys(Icons), mapping: Icons },
  },
  parameters: { controls: { exclude: ['badge', 'iconOnly', 'shape'] } },
  render: ({
    showBadge,
    badgeDot,
    badgeText,
    badgeSize,
    badgeSeverity,
    iconOnly: _iconOnly,
    Icon,
    iconPosition,
    label = 'Button',
    ...args
  }) => {
    const badge = createBadge({
      showBadge,
      badgeDot,
      badgeText,
      badgeSize,
      badgeSeverity,
    })
    const buttonProps: ButtonProps<ButtonBaseVariant> = {
      ...args,
      badge,
      Icon,
      iconPosition,
      label,
    }
    const iconOnlyButtonProps: ButtonProps<ButtonBaseVariant> = {
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
          <Button {...buttonProps} />
        </View>
        <View style={styles.example}>
          <Body>Только иконка</Body>
          <Button {...iconOnlyButtonProps} />
        </View>
      </View>
    )
  },
}

export default meta

type Story = StoryObj<StoryArgs>

const ButtonStory: Story = { args: {}, argTypes: {} }

export { ButtonStory as Button }
