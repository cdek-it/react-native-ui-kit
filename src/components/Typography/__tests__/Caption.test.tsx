import { render } from '@testing-library/react-native'

import { Caption, type CaptionProps } from '../Caption'

describe('Caption component tests', () => {
  const snapshotCases = generatePropsCombinations<CaptionProps>({
    color: ['default', 'secondary', 'primary'],
    disabled: [true, false],
  })

  test.each(snapshotCases)('color = $color, disabled = $disabled', (props) => {
    const renderedCaption = render(<Caption {...props}>Text</Caption>)

    expect(renderedCaption.toJSON()).toMatchSnapshot()
  })

  test('default props', () => {
    const renderedCaption = render(<Caption>Text</Caption>)

    expect(renderedCaption.toJSON()).toMatchSnapshot()
  })
})
