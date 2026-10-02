import { render } from '@testing-library/react-native'

import { ButtonSeverity } from '../ButtonSeverity'

describe('ButtonSeverity', () => {
  test('отображает переданный текст', () => {
    const { getByText } = render(
      <ButtonSeverity label='Button' severity='info' />
    )

    expect(getByText('Button')).toBeOnTheScreen()
  })
})
