import { render } from '@testing-library/react-native'
import React from 'react'

import { Checkbox, type CheckboxProps } from '../Checkbox'

describe('Checkbox', () => {
  const defaultProps: CheckboxProps = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onPress: () => {},
    state: 'default',
  }

  describe('snapshots', () => {
    const snapshotCases: Array<[string, Partial<CheckboxProps>]> = [
      ['default', {}],
      [
        'checked = false, indeterminate = false, state = default',
        {
          checked: false,
          indeterminate: false,
          state: 'default',
        },
      ],
      [
        'checked = true, indeterminate = false, state = default',
        {
          checked: true,
          indeterminate: false,
          state: 'default',
        },
      ],
      [
        'checked = true, indeterminate = true, state = default',
        {
          checked: true,
          indeterminate: true,
          state: 'default',
        },
      ],
      [
        'checked = false, indeterminate = false, state = disabled',
        {
          checked: false,
          indeterminate: false,
          state: 'disabled',
        },
      ],
      [
        'checked = true, indeterminate = false, state = disabled',
        {
          checked: true,
          indeterminate: false,
          state: 'disabled',
        },
      ],
      [
        'checked = false, indeterminate = false, state = danger',
        {
          checked: false,
          indeterminate: false,
          state: 'danger',
        },
      ],
      [
        'checked = true, indeterminate = false, state = danger',
        {
          checked: true,
          indeterminate: false,
          state: 'danger',
        },
      ],
    ]
    test.each(snapshotCases)('%s', (_, props) => {
      const { toJSON } = render(<Checkbox {...defaultProps} {...props} />)
      expect(toJSON()).toMatchSnapshot()
    })
  })
})
