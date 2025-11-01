import { render } from '@testing-library/react-native'

import { Slider, type SliderProps } from '../Slider'

describe('Slider', () => {
  const defaultProps: SliderProps = {
    minPointerValueInit: 10,
    onMaxPointerValueChange: (_) => undefined,
    onMinPointerValueChange: (_) => undefined,
  }

  describe('snapshots', () => {
    const snapshotCases: Array<[string, Partial<SliderProps>]> = [
      ['default', {}],
      ['disabled = false, range = false', { disabled: false, range: false }],
      ['disabled = true, range = false', { disabled: true, range: false }],

      ['disabled = false, range = true', { disabled: false, range: true }],

      ['disabled = true, range = true', { disabled: true, range: true }],

      [
        'disabled = false, range = true, maxPointerValueInit = 80',
        { disabled: false, range: true, maxPointerValueInit: 80 },
      ],

      [
        'disabled = true, range = true, maxPointerValueInit = 80',
        { disabled: true, range: true, maxPointerValueInit: 80 },
      ],
    ]

    test.each(snapshotCases)('%s', (_, props) => {
      const { toJSON } = render(<Slider {...defaultProps} {...props} />)

      expect(toJSON()).toMatchSnapshot()
    })
  })
})
