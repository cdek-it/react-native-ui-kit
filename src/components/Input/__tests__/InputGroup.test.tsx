import { render } from '@testing-library/react-native'
import React from 'react'

import { InputGroup, type InputGroupProps } from '../InputGroup'

jest.mock('../InputTextBase', () => ({
  InputTextBase: 'InputTextBase',
}))

jest.mock('../InputGroupAddon', () => ({
  InputGroupAddon: 'InputGroupAddon',
}))

describe('InputTextBase component functionality tests', () => {
  const snapshotCases: Array<[string, InputGroupProps]> = [
    ['left', { left: 'left text' }],
    ['right', { right: 'right text' }],
    ['left & right', { left: 'left text', right: 'right text' }],
    ['no addons, style', { style: { margin: 10 } }],
  ]

  test.each(snapshotCases)('%s', (_, props) => {
    const { toJSON } = render(<InputGroup {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
