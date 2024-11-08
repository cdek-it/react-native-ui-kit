import { render } from '@testing-library/react-native'
import React from 'react'

import { InputText } from '../InputText'

jest.mock('../InputTextBase', () => ({
  InputTextBase: 'InputTextBase',
}))

describe('InputText component tests', () => {
  test('snapshot', () => {
    const { toJSON } = render(<InputText style={{ margin: 10 }} value='text' />)

    expect(toJSON()).toMatchSnapshot()
  })
})
