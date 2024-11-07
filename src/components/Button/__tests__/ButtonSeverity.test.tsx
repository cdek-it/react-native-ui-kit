import { render } from '@testing-library/react-native'
import React from 'react'

import { ButtonSeverity } from '../ButtonSeverity'
import type { ButtonSeverityProps } from '../types'

describe('ButtonSeverity component tests', () => {
  const buttonSnapshotCases = generatePropsCombinations<ButtonSeverityProps>({
    severity: ['help', 'info', 'warning', 'danger', 'success'],
  })

  test.each(buttonSnapshotCases)('severity - $severity', (props) => {
    const renderedButton = render(<ButtonSeverity {...props} label='Button' />)
    expect(renderedButton.toJSON()).toMatchSnapshot()
  })
})
