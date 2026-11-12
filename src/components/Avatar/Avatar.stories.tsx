import type { Meta, StoryObj } from '@storybook/react'
import { IconActivity, IconUser } from '@tabler/icons-react-native'

import { Badge } from '../Badge'

import { Avatar, type AvatarProps } from './index'

type StoryArgs = Omit<AvatarProps, 'badge' | 'children' | 'source' | 'Icon'> & {
  readonly children: string
  readonly Icon: NonNullable<AvatarProps['Icon']>
  readonly imageSource: 'local' | 'broken'
  readonly isBadgeVisible: boolean
}

const Icons = { IconUser, IconActivity }
const localSource: number = require('./testImage.png')

const brokenSource = { uri: 'file:///__avatar_missing__.png' }

const AvatarConsumer = ({
  type,
  size,
  shape,
  showBadge,
  accessibilityLabel,
  imageSource,
  Icon,
  iconColor,
  children,
  onError,
  isBadgeVisible,
}: StoryArgs) => {
  const common = {
    size,
    shape,
    badge: isBadgeVisible ? <Badge severity='danger'>3</Badge> : null,
    showBadge,
    accessibilityLabel,
  }

  if (type === 'image') {
    return (
      <Avatar
        {...common}
        source={imageSource === 'local' ? localSource : brokenSource}
        type='image'
        onError={onError}
      />
    )
  }

  if (type === 'icon') {
    return <Avatar {...common} Icon={Icon} iconColor={iconColor} type='icon' />
  }

  return (
    <Avatar {...common} type='label'>
      {children}
    </Avatar>
  )
}

const meta: Omit<Meta<StoryArgs>, 'component'> &
  Pick<Meta<typeof Avatar>, 'component'> = {
  title: 'Misc/Avatar',
  component: Avatar,
  args: {
    size: 'base',
    shape: 'circle',
    type: 'label',
    children: 'U',
    Icon: IconUser,
    showBadge: true,
    imageSource: 'local',
    accessibilityLabel: 'Открыть профиль',
  },
  argTypes: {
    size: {
      control: { type: 'radio', labels: { normal: 'normal (deprecated)' } },
      options: ['base', 'large', 'xlarge', 70, 84, 100, 'normal'],
    },
    shape: { control: 'radio', options: ['circle', 'square'] },
    type: { control: 'radio', options: ['icon', 'label', 'image'] },
    children: { control: 'text', if: { arg: 'type', eq: 'label' } },
    Icon: {
      control: 'select',
      options: Object.keys(Icons),
      mapping: Icons,
      if: { arg: 'type', eq: 'icon' },
    },
    iconColor: { control: 'color', if: { arg: 'type', eq: 'icon' } },
    imageSource: {
      control: 'radio',
      options: ['local', 'broken'],
      if: { arg: 'type', eq: 'image' },
    },
    accessibilityLabel: { control: 'text' },
    showBadge: { control: 'boolean' },
    isBadgeVisible: { control: 'boolean' },
    onError: { action: 'OnError' },
  },
  parameters: {
    controls: {
      exclude: [
        'badge',
        'source',
        'onError',
        'style',
        'testID',
        'accessible',
        'accessibilityRole',
        'role',
      ],
    },
  },
  render: (args) => <AvatarConsumer {...args} />,
}

export default meta

type Story = StoryObj<StoryArgs>

const AvatarStory: Story = { tags: ['version:2.0', 'design:pending'] }
export { AvatarStory as Avatar }
