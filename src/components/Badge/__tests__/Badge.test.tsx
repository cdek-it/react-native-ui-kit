import { render } from '@testing-library/react-native'
import React from 'react'

import { Badge, type BadgeProps } from '../Badge'

describe('Badge component tests', () => {
  const snapshotCases: Array<[string, BadgeProps]> = [
    ['dot, severity: basic', { dot: true, severity: 'basic' }],
    ['dot, severity: info', { dot: true, severity: 'info' }],
    ['dot, severity: success', { dot: true, severity: 'success' }],
    ['dot, severity: warning', { dot: true, severity: 'warning' }],
    ['dot, severity: danger', { dot: true, severity: 'danger' }],
    ['severity: basic', { children: '12', severity: 'basic' }],
    ['severity: basic', { children: '12', severity: 'info' }],
    ['severity: basic', { children: '12', severity: 'success' }],
    ['severity: basic', { children: '12', severity: 'warning' }],
    ['severity: basic', { children: '12', severity: 'danger' }],
    ['severity: default', { children: '12' }],
    ['with custom style', { dot: true, severity: 'basic', style: { margin: 10 } }],
  ]

  test.each(snapshotCases)('%s', (_, props) => {
    const renderedBadge = render(<Badge {...props} />)
    expect(renderedBadge.toJSON()).toMatchSnapshot()
  })
})
