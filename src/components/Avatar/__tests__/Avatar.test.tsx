import { IconUser } from '@tabler/icons-react-native'
import { render } from '@testing-library/react-native'
import React from 'react'

import { Badge } from '../../Badge/Badge'
import { Avatar, type AvatarProps } from '../Avatar'

describe('Avatar component tests', () => {
  const snapshotTestsConfig: AvatarProps[] = [
    { size: 'xlarge', shape: 'square', type: 'label', children: 'A' },
    { size: 'large', shape: 'square', type: 'label', children: 'A' },
    { size: 'normal', shape: 'square', type: 'label', children: 'A' },
    { size: 'xlarge', shape: 'circle', type: 'label', children: 'A' },
    { size: 'large', shape: 'circle', type: 'label', children: 'A' },
    { size: 'normal', shape: 'circle', type: 'label', children: 'A' },
    { size: 'xlarge', shape: 'square', type: 'icon', Icon: IconUser },
    { size: 'large', shape: 'square', type: 'icon', Icon: IconUser },
    { size: 'normal', shape: 'square', type: 'icon', Icon: IconUser },
    { size: 'xlarge', shape: 'circle', type: 'icon', Icon: IconUser },
    { size: 'large', shape: 'circle', type: 'icon', Icon: IconUser },
    { size: 'normal', shape: 'circle', type: 'icon', Icon: IconUser },
    { size: 'xlarge', shape: 'square', type: 'image', source: require('./testImage.png') },
    { size: 'large', shape: 'square', type: 'image', source: require('./testImage.png') },
    { size: 'normal', shape: 'square', type: 'image', source: require('./testImage.png') },
    { size: 'xlarge', shape: 'circle', type: 'image', source: require('./testImage.png') },
    { size: 'large', shape: 'circle', type: 'image', source: require('./testImage.png') },
    { size: 'normal', shape: 'circle', type: 'image', source: require('./testImage.png') },
    {
      size: 'normal',
      shape: 'circle',
      type: 'label',
      children: 'A',
      badge: <Badge severity='basic'>12</Badge>,
      showBadge: false,
    },
    {
      size: 'normal',
      shape: 'circle',
      type: 'label',
      children: 'A',
      badge: <Badge severity='basic'>12</Badge>,
      showBadge: true,
    },
  ]

  snapshotTestsConfig.map((props) => {
    it(`Avatar snapshot test: ${props.type} - ${props.shape} - ${props.size}${props.badge ? ` - with badge - show badge: ${props.showBadge}` : ''}`, () => {
      const renderedAvatar = render(<Avatar {...props} />)
      expect(renderedAvatar.toJSON()).toMatchSnapshot()
    })
  })
})
