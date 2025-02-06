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
        'checked = false, indeterminate = false, disabled = false, state = default',
        {
          checked: false,
          indeterminate: false,
          disabled: false,
          state: 'default',
        },
      ],
      [
        'checked = true, indeterminate = false, disabled = false, state = default',
        {
          checked: true,
          indeterminate: false,
          disabled: false,
          state: 'default',
        },
      ],
      [
        'checked = true, indeterminate = true, disabled = false, state = default',
        {
          checked: true,
          indeterminate: true,
          disabled: false,
          state: 'default',
        },
      ],
      [
        'checked = true, indeterminate = true, disabled = true, state = default',
        {
          checked: true,
          indeterminate: true,
          disabled: true,
          state: 'default',
        },
      ],
      [
        'checked = false, indeterminate = false, disabled = false, state = danger',
        {
          checked: false,
          indeterminate: false,
          disabled: false,
          state: 'danger',
        },
      ],
      [
        'checked = true, indeterminate = false, disabled = false, state = danger',
        {
          checked: true,
          indeterminate: false,
          disabled: false,
          state: 'danger',
        },
      ],
      [
        'checked = true, indeterminate = true, disabled = false, state = danger',
        {
          checked: true,
          indeterminate: true,
          disabled: false,
          state: 'danger',
        },
      ],
      [
        'checked = true, indeterminate = true, disabled = true, state = danger',
        {
          checked: true,
          indeterminate: true,
          disabled: true,
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
