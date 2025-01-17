import type { Meta, StoryObj } from '@storybook/react'
import { IconUser } from '@tabler/icons-react-native'
import React, { useState } from 'react'
import { View, Text } from 'react-native'

import { Badge } from '../Badge'

import { Tabs, TabItem, TabPanel } from '.'

const meta: Meta<typeof Tabs> = {
  title: 'Tabs',
  component: Tabs,
}
export default meta
type Story = StoryObj<typeof Tabs>

const TabsExample = (props: { disabled?: boolean }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <View>
      <Tabs activeIndex={activeIndex} disabled={props.disabled} onChange={setActiveIndex}>
        <TabItem Icon={IconUser} index={0} label='First Tab' />
        <TabItem index={1} label='Second Tab' />
        <TabItem badge={<Badge severity='danger'>0</Badge>} index={2} label='Third Tab' />
      </Tabs>
      <TabPanel activeIndex={activeIndex} index={0}>
        <Text>Content First Tab</Text>
      </TabPanel>

      <TabPanel activeIndex={activeIndex} index={1}>
        <Text>Content Second Tab</Text>
      </TabPanel>
    </View>
  )
}

export const TabStory: Story = {
  args: {
    disabled: false,
  },
  render: (args) => <TabsExample {...args} />,
}
