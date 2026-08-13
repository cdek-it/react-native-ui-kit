import { render } from '@testing-library/react-native'

import { ButtonSeverity } from '../ButtonSeverity'

describe('ButtonSeverity', () => {
  test.each(['info', 'warning', 'danger', 'success'] as const)(
    'отображает текст для severity=%s',
    (severity) => {
      const { getByText } = render(
        <ButtonSeverity label='Button' severity={severity} />
      )

      expect(getByText('Button')).toBeOnTheScreen()
    }
  )
})
