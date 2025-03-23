import { render } from '@testing-library/react-native'

import { Subtitle, type SubtitleProps } from '../Subtitle'

describe('Subtitle component tests', () => {
  const snapshotCases = generatePropsCombinations<Partial<SubtitleProps>>({
    base: [true, false, undefined],
    color: ['default', 'primary', 'secondary', undefined],
    style: [{ margin: 10 }],
  })

  test.each(snapshotCases)('base = $base, color = $color', (props) => {
    const renderedTitle = render(<Subtitle {...props}>Text</Subtitle>)
    expect(renderedTitle.toJSON()).toMatchSnapshot()
  })
})
