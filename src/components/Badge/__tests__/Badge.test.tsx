import { fireEvent, render } from '@testing-library/react-native'

import { Badge, type BadgeSeverity } from '../Badge'

describe('Badge', () => {
  const severities: BadgeSeverity[] = [
    'primary',
    'basic',
    'info',
    'success',
    'warning',
    'danger',
  ]

  test('доступен как один текстовый элемент с именем из children по умолчанию', () => {
    const { getAllByRole, getByRole } = render(<Badge>12</Badge>)

    expect(getByRole('text', { name: '12' })).toBeOnTheScreen()
    expect(getAllByRole('text')).toHaveLength(1)
  })

  test('использует accessibilityLabel вместо children как доступное имя', () => {
    const { getByRole, getAllByRole } = render(
      <Badge accessibilityLabel='12 уведомлений'>12</Badge>
    )

    expect(getByRole('text')).toHaveAccessibleName('12 уведомлений')
    expect(getAllByRole('text')).toHaveLength(1)
  })

  test('обновляет доступное имя при изменении children', () => {
    const { getByRole, queryByRole, rerender } = render(<Badge>12</Badge>)

    rerender(<Badge>13</Badge>)

    expect(getByRole('text', { name: '13' })).toBeOnTheScreen()
    expect(queryByRole('text', { name: '12' })).toBeNull()
  })

  test('оставляет точку без accessibilityLabel декоративной', () => {
    const { getByTestId, queryByRole } = render(<Badge dot testID='Badge' />)

    expect(getByTestId('Badge')).toBeOnTheScreen()
    expect(queryByRole('text')).toBeNull()
  })

  test('делает точку с accessibilityLabel одним доступным элементом', () => {
    const { getByRole, getAllByRole } = render(
      <Badge dot accessibilityLabel='Есть новые уведомления' />
    )

    expect(
      getByRole('text', { name: 'Есть новые уведомления' })
    ).toBeOnTheScreen()
    expect(getAllByRole('text')).toHaveLength(1)
  })

  test('не делает измерительный текст доступным', () => {
    const { getAllByText, getByText } = render(<Badge>12</Badge>)

    expect(getByText('12')).toBeOnTheScreen()
    expect(getAllByText('12', { includeHiddenElements: true })).toHaveLength(2)
  })

  test('передает нативные пропсы и событие layout корневому View', () => {
    const onLayout = jest.fn()
    const { getByRole } = render(
      <Badge
        accessibilityHint='Количество новых уведомлений'
        accessibilityState={{ busy: true }}
        nativeID='BadgeRoot'
        onLayout={onLayout}
      >
        12
      </Badge>
    )
    const badge = getByRole('text', { name: '12' })
    const event = {
      nativeEvent: { layout: { x: 0, y: 0, width: 24, height: 24 } },
    }

    expect(badge.props.nativeID).toBe('BadgeRoot')
    expect(badge.props.accessibilityHint).toBe('Количество новых уведомлений')
    expect(badge.props.accessibilityState).toStrictEqual({ busy: true })

    fireEvent(badge, 'layout', event)

    expect(onLayout).toHaveBeenCalledExactlyOnceWith(event)
  })

  test('учитывает явно переданное accessible=false', () => {
    const { getByText, queryByRole } = render(
      <Badge accessible={false}>12</Badge>
    )

    expect(getByText('12')).toBeOnTheScreen()
    expect(queryByRole('text')).toBeNull()
  })

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
