import { render, within } from '@testing-library/react-native'

import { ButtonBadge, ButtonBadgeTestId } from '../ButtonBadge'

describe('ButtonBadge', () => {
  test('преобразует badgeLabel в текстовый бейдж', () => {
    const { getByText } = render(
      <ButtonBadge badgeLabel='Badge' badgeSeverity='danger' label='Button' />
    )

    expect(
      getByText('Badge', { includeHiddenElements: true })
    ).toBeOnTheScreen()
  })

  test.each([undefined, ''])(
    'отображает точку при badgeLabel=%p',
    (badgeLabel) => {
      const { getByTestId } = render(
        <ButtonBadge
          badgeLabel={badgeLabel}
          badgeSeverity='info'
          label='Button'
        />
      )

      const badge = getByTestId(ButtonBadgeTestId.badge, {
        includeHiddenElements: true,
      })

      expect(badge).toBeOnTheScreen()
      expect(
        within(badge).queryAllByText(/.*/, { includeHiddenElements: true })
      ).toHaveLength(0)
    }
  )
})
