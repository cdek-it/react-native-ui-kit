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

const Icons = { IconArrowDownRight, IconArrowDownLeft, undefined }
const styles = StyleSheet.create({
  container: { gap: 16 },
  example: { gap: 8 },
})

const meta: Meta<typeof ButtonSeverity> = {
  title: 'Button/ButtonSeverity',
  component: ButtonSeverity,
  args: {
    size: 'base',
    rounded: false,
    appearance: 'filled',
    label: 'Button',
    loading: false,
    disabled: false,
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
    onPress: { action: 'OnPress' },
    severity: {
      control: 'radio',
      options: ['info', 'success', 'warning', 'danger'],
    },
    Icon: { control: 'select', options: Object.keys(Icons), mapping: Icons },
  },
  parameters: { controls: { exclude: ['iconOnly', 'shape', 'variant'] } },
  render: ({
    iconOnly: _iconOnly,
    Icon,
    iconPosition,
    label = 'Button',
    ...args
  }) => {
    const buttonProps: ButtonProps<ButtonSeverityVariant> &
      ButtonSeverityProps = { ...args, Icon, iconPosition, label }
    const iconOnlyButtonProps: ButtonProps<ButtonSeverityVariant> &
      ButtonSeverityProps = {
      ...args,
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

type Story = StoryObj<typeof ButtonSeverity>

const ButtonStory: Story = { args: {}, argTypes: {} }

export { ButtonStory as ButtonSeverity }
