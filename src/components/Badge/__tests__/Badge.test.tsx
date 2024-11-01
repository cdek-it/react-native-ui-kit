import { render } from '@testing-library/react-native'
import React from 'react'

import { Badge, type BadgeProps } from '../Badge'

describe('Badge component tests', () => {
  const snapshotTestsConfig: BadgeProps[] = [
    { dot: true, severity: 'basic' },
    { dot: true, severity: 'info' },
    { dot: true, severity: 'success' },
    { dot: true, severity: 'warning' },
    { dot: true, severity: 'danger' },
    { children: '12', severity: 'basic' },
    { children: '12', severity: 'info' },
    { children: '12', severity: 'success' },
    { children: '12', severity: 'warning' },
    { children: '12', severity: 'danger' },
  ]

  snapshotTestsConfig.map((props) =>
    it(`Badge snapshot test: ${props.dot ? 'dot ' : ''} - ${props.severity}`, () => {
      const renderedBadge = render(<Badge {...props} />)
      expect(renderedBadge.toJSON()).toMatchSnapshot()
    })
  )

  it('Badge snapshot test: Badge with custom style', () => {
    const renderedBadge = render(<Badge dot severity='basic' style={{ margin: 10 }} />)
    expect(renderedBadge.toJSON()).toMatchSnapshot()
  })
})
