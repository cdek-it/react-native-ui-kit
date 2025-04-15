import type { Meta, StoryObj } from '@storybook/react'

import { IconExternalLink, IconLink } from '@tabler/icons-react-native'

import { View } from 'react-native'

import { Anchor } from './Anchor'
import { Body } from './Body'

const Icons = { IconExternalLink, IconLink, noIcon: undefined }

const meta: Meta<typeof Anchor> = {
  title: 'Typography/Anchor',
  component: Anchor,
  args: {
    children: 'href',
    base: false,
    visited: false,
    LeftIcon: undefined,
    RightIcon: undefined,
  },
  argTypes: {
    LeftIcon: { control: 'radio', options: Object.keys(Icons), mapping: Icons },
    RightIcon: {
      control: 'radio',
      options: Object.keys(Icons),
      mapping: Icons,
    },
    onPress: { action: 'onPress' },
  },
}

export default meta

type Story = StoryObj<typeof Anchor>

const AnchorStory: Story = {
  render: (args) => (
    <View style={{ gap: 10 }}>
      <Anchor {...args} />

      <Body base>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus
        adipisci ducimus est fuga hic iusto laborum minima modi, non reiciendis
        repellat repudiandae{' '}
        <Anchor {...args} noWrapper>
          sequi sint
        </Anchor>
      </Body>
    </View>
  ),
}

export { AnchorStory as Anchor }
