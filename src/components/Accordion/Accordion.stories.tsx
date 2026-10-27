import type { Meta, StoryObj } from '@storybook/react'
import {
  IconDiamond,
  IconList,
  IconSquare,
  IconUser,
} from '@tabler/icons-react-native'

import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Body } from '../Typography'

import { Accordion } from './Accordion'

const Icons = { undefined, IconUser, IconList, IconSquare }
const Extras = {
  undefined,
  IconDiamond: <IconDiamond height={21} width={21} />,
}

const meta: Meta<typeof Accordion> = {
  title: 'Panel/Accordion',
  component: Accordion,
  args: {
    title: 'Accordion',
    Icon: undefined,
    titleExtra: undefined,
    withSeparator: false,
    disabled: false,
    isInitiallyExpanded: false,
  },
  argTypes: {
    Icon: { control: 'select', options: Object.keys(Icons), mapping: Icons },
    title: { control: 'text' },
    titleExtra: {
      control: 'select',
      options: Object.keys(Extras),
      mapping: Extras,
    },
    withSeparator: { control: 'boolean' },
    disabled: { control: 'boolean' },
    isInitiallyExpanded: { control: 'boolean' },
  },
  parameters: { controls: { exclude: ['children', 'style', 'testID'] } },
  render: (args) => (
    // Начальное состояние Accordion применяется только при монтировании.
    <Accordion
      key={args.isInitiallyExpanded ? 'expanded' : 'collapsed'}
      {...args}
    >
      <View style={styles.content}>
        <Body>Это контент аккордеона</Body>
      </View>
    </Accordion>
  ),
}

export default meta

type Story = StoryObj<typeof Accordion>

const AccordionStory: Story = {}

export { AccordionStory as Accordion }

const styles = StyleSheet.create({ content: { padding: 24 } })
