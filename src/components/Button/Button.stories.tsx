import type { Meta, StoryObj } from '@storybook/react'
import {
  IconArrowDownRight,
  IconArrowDownLeft,
} from '@tabler/icons-react-native'
import { StyleSheet, View } from 'react-native'

import { Body } from '../Typography'

import { Button } from './Button'
import type { ButtonBaseVariant, ButtonProps } from './types'

const Icons = { IconArrowDownRight, IconArrowDownLeft, undefined }
const styles = StyleSheet.create({
  container: { gap: 16 },
  example: { gap: 8 },
})

const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  args: {
    size: 'base',
    shape: 'square',
    variant: 'primary',
    label: 'Button',
    loading: false,
    disabled: false,
    iconPosition: 'prefix',
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
    onPress: { action: 'OnPress' },
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
    const buttonProps: ButtonProps<ButtonBaseVariant> = {
      ...args,
      Icon,
      iconPosition,
      label,
    }
    const iconOnlyButtonProps: ButtonProps<ButtonBaseVariant> = {
      ...args,
      iconOnly: true,
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

type Story = StoryObj<typeof Button>

const ButtonStory: Story = { args: {}, argTypes: {} }

export { ButtonStory as Button }
