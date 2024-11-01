import { render } from '@testing-library/react-native'
import React from 'react'

import { Avatar, type AvatarProps } from '../Avatar'

describe('Avatar component tests', () => {
  const snapshotTestsConfig: AvatarProps[] = [
    { size: 'xlarge', shape: 'square', type: 'label', children: 'A' },
    { size: 'large', shape: 'square', type: 'label', children: 'A' },
    { size: 'normal', shape: 'square', type: 'label', children: 'A' },
    { size: 'xlarge', shape: 'circle', type: 'label', children: 'A' },
    { size: 'large', shape: 'circle', type: 'label', children: 'A' },
    { size: 'normal', shape: 'circle', type: 'label', children: 'A' },
    // TODO: Add tests for Avatar with Icon and Image types
  ]

  snapshotTestsConfig.map((props) => {
    it(`Avatar snapshot test: ${props.type} - ${props.shape} - ${props.size}`, () => {
      const renderedAvatar = render(<Avatar {...props} />)
      expect(renderedAvatar.toJSON()).toMatchSnapshot()
    })
  })
})
