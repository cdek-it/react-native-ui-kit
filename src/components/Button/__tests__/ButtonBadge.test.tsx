import { render } from '@testing-library/react-native'

import { ButtonBadge } from '../ButtonBadge'

describe('ButtonSeverity component tests', () => {
  test('badge - basic', () => {
    const renderedButton = render(
      <ButtonBadge badgeLabel='Badge' badgeSeverity='danger' label='Button' />
    )

    expect(renderedButton.toJSON()).toMatchSnapshot()
  })
})
