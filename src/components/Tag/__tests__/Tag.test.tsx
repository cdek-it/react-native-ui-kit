import { IconCheck } from '@tabler/icons-react-native'
import { render } from '@testing-library/react-native'

import { Tag, type TagProps } from '../Tag'

describe('Tag', () => {
  const defaultProps: TagProps = { text: 'Tag' }
  const snapshotCases: Array<[string, Partial<TagProps>]> = [
    ['default', {}],
    [
      'severity = secondary, rounded = false, showIcon = true, with Icon',
      {
        severity: 'secondary',
        rounded: false,
        showIcon: true,
        Icon: IconCheck,
      },
    ],
    [
      'severity = basic, rounded = true, with Icon',
      { severity: 'basic', rounded: true, Icon: IconCheck },
    ],
    [
      'severity = info, showIcon = false, with Icon',
      { severity: 'info', Icon: IconCheck },
    ],
    [
      'severity = success, with custom styles',
      { severity: 'success', style: { margin: 10 } },
    ],
    ['severity = warning', { severity: 'warning' }],
    ['severity = danger', { severity: 'danger' }],
  ]

  test.each(snapshotCases)('snapshot: %s', (_, props) => {
    const { toJSON } = render(<Tag {...defaultProps} {...props} />)

    expect(toJSON()).toMatchSnapshot()
  })
})
