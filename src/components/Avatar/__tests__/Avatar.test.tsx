import { IconUser } from '@tabler/icons-react-native'
import { render } from '@testing-library/react-native'

import { Badge } from '../../Badge/Badge'
import { Avatar, type AvatarProps } from '../Avatar'

describe('Avatar component tests', () => {
  const snapshotCases: Array<[string, AvatarProps]> = [
    [
      'Size: xlarge, shape: square, type: label',
      { size: 'xlarge', shape: 'square', type: 'label', children: 'A' },
    ],
    [
      'Size: large, shape: square, type: label',
      { size: 'large', shape: 'square', type: 'label', children: 'A' },
    ],
    [
      'Size: normal, shape: square, type: label',
      { size: 'normal', shape: 'square', type: 'label', children: 'A' },
    ],
    [
      'Size: xlarge, shape: circle, type: label',
      { size: 'xlarge', shape: 'circle', type: 'label', children: 'A' },
    ],

    [
      'Size: large, shape: circle, type: label',
      { size: 'large', shape: 'circle', type: 'label', children: 'A' },
    ],
    [
      'Size: normal, shape: circle, type: label',
      { size: 'normal', shape: 'circle', type: 'label', children: 'A' },
    ],
    [
      'Size: xlarge, shape: sqare, type: icon',
      { size: 'xlarge', shape: 'square', type: 'icon', Icon: IconUser },
    ],
    [
      'Size: large, shape: sqare, type: icon',
      { size: 'large', shape: 'square', type: 'icon', Icon: IconUser },
    ],
    [
      'Size: normal, shape: sqare, type: icon',
      { size: 'normal', shape: 'square', type: 'icon', Icon: IconUser },
    ],
    [
      'Size: xlarge, shape: circle, type: icon',
      { size: 'xlarge', shape: 'circle', type: 'icon', Icon: IconUser },
    ],
    [
      'Size: large, shape: circle, type: icon',
      { size: 'large', shape: 'circle', type: 'icon', Icon: IconUser },
    ],
    [
      'Size: nomal, shape: circle, type: icon',
      { size: 'normal', shape: 'circle', type: 'icon', Icon: IconUser },
    ],
    [
      'Size: xlarge, shape: square, type: image',
      {
        size: 'xlarge',
        shape: 'square',
        type: 'image',
        source: require('./testImage.png'),
      },
    ],
    [
      'Size: large, shape: square, type: image',
      {
        size: 'large',
        shape: 'square',
        type: 'image',
        source: require('./testImage.png'),
      },
    ],
    [
      'Size: normal, shape: square, type: image',
      {
        size: 'normal',
        shape: 'square',
        type: 'image',
        source: require('./testImage.png'),
      },
    ],
    [
      'Size: xlarge, shape: circle, type: image',
      {
        size: 'xlarge',
        shape: 'circle',
        type: 'image',
        source: require('./testImage.png'),
      },
    ],
    [
      'Size: large, shape: circle, type: image',
      {
        size: 'large',
        shape: 'circle',
        type: 'image',
        source: require('./testImage.png'),
      },
    ],
    [
      'Size: normal, shape: circle, type: image',
      {
        size: 'normal',
        shape: 'circle',
        type: 'image',
        source: require('./testImage.png'),
      },
    ],
    [
      'With badge, showBadge: false',
      {
        size: 'normal',
        shape: 'circle',
        type: 'label',
        children: 'A',
        badge: <Badge severity='basic'>12</Badge>,
        showBadge: false,
      },
    ],
    [
      'With badge, showBadge: true',
      {
        size: 'normal',
        shape: 'circle',
        type: 'label',
        children: 'A',
        badge: <Badge severity='basic'>12</Badge>,
        showBadge: true,
      },
    ],
  ]

  test.each(snapshotCases)('%s', (_, props) => {
    const renderedAvatar = render(<Avatar {...props} />)

    expect(renderedAvatar.toJSON()).toMatchSnapshot()
  })
})
