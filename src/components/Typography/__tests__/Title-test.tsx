import { render } from '@testing-library/react-native'

import { Title, type TitleProps } from '../Title'

describe('Title component tests', () => {
  const snapshotCases = generatePropsCombinations<TitleProps>({
    level: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  })

  test.each(snapshotCases)('level = $level', (props) => {
    const renderedTitle = render(<Title {...props}>Text</Title>)
    expect(renderedTitle.toJSON()).toMatchSnapshot()
  })
})
