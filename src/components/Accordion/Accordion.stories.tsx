import type { Meta, StoryObj } from '@storybook/react'
import {
  IconDiamond,
  IconList,
  IconSquare,
  IconUser,
} from '@tabler/icons-react-native'

import { memo } from 'react'
import { View } from 'react-native'

import { Body } from '../Typography'

import { Accordion, type AccordionProps } from './Accordion'

const Icons = { undefined, IconUser, IconList, IconSquare }
const Extras = {
  undefined,
  IconDiamond: <IconDiamond height={21} width={21} />,
}

const TestAccordion = memo<Omit<AccordionProps, 'childern'>>((props) => {
  return (
    <Accordion {...props}>
      <View style={{ padding: 24, backgroundColor: 'blanchedalmond' }}>
        <Body>Это контент аккордеона</Body>
      </View>
    </Accordion>
  )
})

const meta: Meta<typeof Accordion> = {
  title: 'Panel/Accordion',
  component: TestAccordion,
  args: {
    title: 'Accordion',
    Icon: undefined,
    titleExtra: undefined,
    withSeparator: false,
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
  },
  parameters: {
    notes: `
      #### Акордеон - полный набор свойств

      <Accordion
        title="Menu item title"
        Icon=IconUser,
        extra=IconDiamond,
        isExpanded
      >
        // Content
      </Accordion>
  `,
  },
  decorators: [
    (Story) => (
      <View
        style={{ padding: 16, alignContent: 'center', alignItems: 'center' }}
      >
        <Story />
      </View>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Accordion>

const AccordionStory: Story = {}

export { AccordionStory as Accordion }

export const Expanded: Story = { args: { isInitiallyExpanded: true } }

export const LongTitle: Story = {
  args: {
    title:
      'Длинный заголовок аккордеона, который занимает несколько строк и остаётся читаемым при раскрытии содержимого',
    Icon: IconUser,
    titleExtra: Extras.IconDiamond,
  },
}

export const LongTitleExpanded: Story = {
  args: { ...LongTitle.args, isInitiallyExpanded: true },
}
