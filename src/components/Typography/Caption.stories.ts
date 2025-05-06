import type { Meta, StoryObj } from '@storybook/react'

import {
  IconInfoCircle,
  IconBuildingSkyscraper,
} from '@tabler/icons-react-native'

import { Caption } from './Caption'

const icons = { IconInfoCircle, IconBuildingSkyscraper, none: undefined }

const meta: Meta<typeof Caption> = {
  title: 'Typography/Caption',
  component: Caption,
  args: { color: 'default', children: 'Test' },
  argTypes: {
    color: { control: 'radio', options: ['default', 'secondary', 'primary'] },
    Icon: { control: 'radio', options: Object.keys(icons), mapping: icons },
  },
}

export default meta

type Story = StoryObj<typeof Caption>

const CaptionStory: Story = {}

export { CaptionStory as Caption }
