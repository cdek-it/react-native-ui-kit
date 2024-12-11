import { render } from '@testing-library/react-native'
import React from 'react'

import { Chip, type ChipProps } from '../Chip'

describe('Chip component tests', () => {
  const snapshotCases: Array<[string, ChipProps]> = [
    ['removable: true', { removable: true, label: 'Chip' }],
    ['removable: false', { removable: false, label: 'Chip' }],
    ['removable: true, disabled: true', { removable: true, disabled: true, label: 'Chip' }],
    ['removable: false, disabled: true', { removable: false, disabled: true, label: 'Chip' }],
  ]

  test.each(snapshotCases)('%s', (_, props) => {
    const renderedChip = render(<Chip {...props} />)
    expect(renderedChip.toJSON()).toMatchSnapshot()
  })
})
