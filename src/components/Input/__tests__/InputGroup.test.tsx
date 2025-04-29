import { render } from '@testing-library/react-native'

import { InputGroup, type InputGroupProps } from '../InputGroup'

jest.mock('../InputTextBase', () => ({ InputTextBase: 'InputTextBase' }))

jest.mock('../InputGroupAddon', () => ({ InputGroupAddon: 'InputGroupAddon' }))

describe('InputTextBase component functionality tests', () => {
  const snapshotCases: Array<[string, InputGroupProps]> = [
    ['left', { left: 'left text', input: 'InputTextBase' }],
    ['right', { right: 'right text', input: 'InputTextBase' }],
    [
      'left & right',
      { left: 'left text', right: 'right text', input: 'InputTextBase' },
    ],
    ['no addons, style', { style: { margin: 10 }, input: 'InputTextBase' }],
  ]

  test.each(snapshotCases)('%s', (_, props) => {
    const { toJSON } = render(<InputGroup {...props} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
