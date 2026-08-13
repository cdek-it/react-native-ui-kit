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
})
