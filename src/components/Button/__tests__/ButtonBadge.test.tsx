import { render } from '@testing-library/react-native'

import { ButtonBadge, ButtonBadgeTestId } from '../ButtonBadge'

describe('ButtonBadge', () => {
  test('отображает текст кнопки и бейджа', () => {
    const { getByText } = render(
      <ButtonBadge badgeLabel='Badge' badgeSeverity='danger' label='Button' />
    )

    expect(getByText('Button')).toBeOnTheScreen()
    expect(getByText('Badge')).toBeOnTheScreen()
  })

  test('отображает бейдж без текста в режиме dot', () => {
    const { getByTestId, queryByText } = render(
      <ButtonBadge badgeSeverity='info' label='Button' />
    )

    expect(getByTestId(ButtonBadgeTestId.badge)).toBeOnTheScreen()
    expect(queryByText('Badge')).not.toBeOnTheScreen()
  })

  test.each([
    { loading: true },
    { disabled: true },
    { loading: true, disabled: true },
  ])('сохраняет бейдж при %j', (state) => {
    const { getByText, getAllByRole } = render(
      <ButtonBadge
        badgeLabel='3'
        badgeSeverity='danger'
        label='Уведомления'
        {...state}
      />
    )

    expect(getByText('3')).toBeOnTheScreen()
    expect(getAllByRole('button')).toHaveLength(1)
  })
})
