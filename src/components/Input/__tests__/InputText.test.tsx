import { render } from '@testing-library/react-native'

import { InputText } from '../InputText'

jest.mock('../InputTextBase/InputTextBase', () => ({
  InputTextBase: 'InputTextBase',
}))

describe('InputText component tests', () => {
  test('snapshot', () => {
    const { toJSON } = render(<InputText style={{ margin: 10 }} value='text' />)

    expect(toJSON()).toMatchSnapshot()
  })
})
