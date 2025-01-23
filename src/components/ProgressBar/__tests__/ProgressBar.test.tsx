import { render } from '@testing-library/react-native'
import React from 'react'

import { ProgressBar, type ProgressBarProps } from '../ProgressBar'

describe('ProgressBar component test', () => {
  const progressBarSnapshoteCases = generatePropsCombinations<ProgressBarProps>({
    value: [-50, 0, 50, 100, 150],
    showValue: [true, false],
    style: [
      { height: 10, width: 100 },
      { height: 20, width: 150 },
    ],
  })

  test.each(progressBarSnapshoteCases)(
    'value - $value, showValue - $showValue, style - $style',
    (props) => {
      const renderedProgressBar = render(<ProgressBar {...props} />)
      expect(renderedProgressBar.toJSON()).toMatchSnapshot()
    }
  )
})
