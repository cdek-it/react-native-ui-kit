import { render } from '@testing-library/react-native'

import { RadioButton, type RadioButtonProps } from '../RadioButton'

describe('RadioButton', () => {
  const defaultProps: RadioButtonProps = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onPress: () => {},
  }

  describe('snapshots', () => {
    const snapshotCases: Array<[string, Partial<RadioButtonProps>]> = [
      ['default', {}],
      [
        'checked = true, disabled = false, state = danger',
        { checked: true, disabled: false, state: 'danger' },
      ],
      [
        'checked = false, disabled = false, state = danger',
        { checked: false, disabled: false, state: 'danger' },
      ],

      [
        'checked = true, disabled = false, state = default',
        { checked: true, disabled: false, state: 'default' },
      ],
      [
        'checked = false, disabled = false, state = default',
        { checked: false, disabled: false, state: 'default' },
      ],

      [
        'checked = true, disabled = true, state = default',
        { checked: true, disabled: true, state: 'default' },
      ],
      [
        'checked = false, disabled = true, state = default',
        { checked: false, disabled: true, state: 'default' },
      ],
    ]

    test.each(snapshotCases)('%s', (_, props) => {
      const { toJSON } = render(<RadioButton {...defaultProps} {...props} />)

      expect(toJSON()).toMatchSnapshot()
    })
  })
})
