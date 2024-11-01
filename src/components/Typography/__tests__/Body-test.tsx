import { render } from '@testing-library/react-native'
import React from 'react'

import { Body, type BodyProps } from '../Body'

describe('Body component tests', () => {
  const snapshotCases = generatePropsCombinations<BodyProps>({
    base: [true, false],
    color: ['default', 'secondary', 'primary'],
    disabled: [true, false],
    paragraph: [true, false],
    weight: ['regular', 'medium', 'bold'],
  })

  test.each(snapshotCases)(
    'base = $base, color = $color, disabled = $disabled, paragraph = $paragraph, weight = $weight',
    (props) => {
      const renderedBody = render(<Body {...props}>Text</Body>)
      expect(renderedBody.toJSON()).toMatchSnapshot()
    }
  )

  test('default props', () => {
    const renderedBody = render(<Body>Text</Body>)
    expect(renderedBody.toJSON()).toMatchSnapshot()
  })
})
