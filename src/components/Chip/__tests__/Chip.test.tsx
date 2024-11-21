import { render } from '@testing-library/react-native'
import React from 'react'

import { Chip, type ChipProps } from '../Chip'

describe('Chip component tests', () => {
  const snapshotCases: Array<[string, ChipProps]> = [
    ['showClose: true', { showClose: true, children: 'Chip' }],
    ['showClose: false', { showClose: false, children: 'Chip' }],
    ['showClose: true, disabled: true', { showClose: true, disabled: true, children: 'Chip' }],
    ['showClose: false, disabled: true', { showClose: false, disabled: true, children: 'Chip' }],
  ]

  test.each(snapshotCases)('%s', (_, props) => {
    const renderedChip = render(<Chip {...props} />)
    expect(renderedChip.toJSON()).toMatchSnapshot()
  })
})
