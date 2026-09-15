import { render } from '@testing-library/react-native'

import { Badge, type BadgeSeverity } from '../Badge'

describe('Badge', () => {
  const severities: BadgeSeverity[] = [
    'basic',
    'info',
    'success',
    'warning',
    'danger',
  ]

  test.each(severities)(
    'отображает переданный текст для severity %s',
    (severity) => {
      const { getByText } = render(<Badge severity={severity}>12</Badge>)

      expect(getByText('12')).toBeOnTheScreen()
    }
  )

  test.each(severities)('отображает dot для severity %s', (severity) => {
    const { getByTestId, queryByText } = render(
      <Badge dot severity={severity} testID='Badge' />
    )

    expect(getByTestId('Badge')).toBeOnTheScreen()
    expect(queryByText('12')).not.toBeOnTheScreen()
  })

  test.each(['large', 'xlarge'] as const)(
    'отображает переданный текст для размера %s',
    (size) => {
      const { getByText } = render(
        <Badge severity='danger' size={size}>
          12
        </Badge>
      )

      expect(getByText('12')).toBeOnTheScreen()
    }
  )

  test.each(['large', 'xlarge'] as const)(
    'отображает dot-вариант для размера %s',
    (size) => {
      const { getByTestId } = render(<Badge dot size={size} testID='Badge' />)

      expect(getByTestId('Badge')).toBeOnTheScreen()
    }
  )
})
