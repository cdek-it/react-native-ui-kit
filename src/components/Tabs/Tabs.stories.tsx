import type { Meta, StoryObj } from '@storybook/react'
import { IconUser } from '@tabler/icons-react-native'
import React, { useState } from 'react'
import { View, Text } from 'react-native'

import { Badge } from '../Badge'

import { Tabs, TabPanel } from '.'

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
      <Tabs
        activeIndex={activeIndex}
        disabled={props.disabled}
        items={[
          { Icon: IconUser, label: 'First', key: '1' },
          { label: 'Second Tab', key: '2' },
          { badge: <Badge severity='danger'>0</Badge>, label: 'Long Third Tab', key: '3' },
        ]}
        onChange={setActiveIndex}
      />
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
