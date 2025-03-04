import { render } from '@testing-library/react-native'
import React from 'react'

import { Service, type ServiceProps } from '../Service'

describe('Body component tests', () => {
  const snapshotCases = generatePropsCombinations<ServiceProps>({
    base: [true, false],
    showIcon: [true, false],
    variant: ['danger', 'help', 'info', 'success', 'warning'],
  })

  test.each(snapshotCases)('base = $base, showIcon = $showIcon, variant = $variant', (props) => {
    const renderedBody = render(<Service {...props}>Text</Service>)
    expect(renderedBody.toJSON()).toMatchSnapshot()
  })
})
