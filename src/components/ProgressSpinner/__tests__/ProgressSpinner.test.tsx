import { render } from '@testing-library/react-native'
import React from 'react'

import { ProgressSpinner, type ProgressSpinnerProps } from '../ProgressSpinner'

describe('ProgressSpinner', () => {
  const progressSpinnerSnapshotCases = generatePropsCombinations<ProgressSpinnerProps>({
    size: ['xl', 'lg', 'md', 'sm', undefined],
    fill: ['primary', 'white', undefined],
  })

  test.each(progressSpinnerSnapshotCases)('%p', (props) => {
    const { toJSON } = render(<ProgressSpinner {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
