import { IconCheck } from '@tabler/icons-react-native'
import { render } from '@testing-library/react-native'
import React from 'react'

import { Divider, type DividerProps } from '../Divider'

describe('Divider', () => {
  const snapshotCases: Array<[DividerProps]> = [
    [{}],
    [{ Icon: IconCheck, align: 'start', layout: 'horizontal', style: { margin: 10 } }],
    [{ Icon: IconCheck, align: 'end', layout: 'vertical', text: 'test', type: 'solid' }],
    [{ Icon: IconCheck, align: 'end', layout: 'vertical', showIcon: false, type: 'dash' }],
    [{ Icon: IconCheck, align: 'end', layout: 'horizontal', text: 'test', showIcon: false }],
    [{ Icon: IconCheck, align: 'center', layout: 'vertical', text: 'test', showContent: false }],
    [{ align: 'end', layout: 'horizontal', text: 'test', showContent: false }],
  ]

  test.each(snapshotCases)('%p', (props) => {
    const { toJSON } = render(<Divider {...props} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
