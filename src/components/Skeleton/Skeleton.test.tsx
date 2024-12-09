import { render } from '@testing-library/react-native'
import React from 'react'

import { ANIMATION_DURATION, Skeleton } from './Skeleton'

describe('Skeleton', () => {
  test('before animation started', () => {
    const { toJSON } = render(<Skeleton style={{ height: 50 }} />)

    expect(toJSON()).toMatchSnapshot('before animation started')
  })

  test('50% animation', () => {
    jest.useFakeTimers()

    const { toJSON } = render(<Skeleton style={{ height: 50 }} />)

    jest.advanceTimersByTime(ANIMATION_DURATION / 2)
    expect(toJSON()).toMatchSnapshot()
  })

  test('100% animation', () => {
    jest.useFakeTimers()

    const { toJSON } = render(<Skeleton style={{ height: 50 }} />)

    jest.advanceTimersByTime(ANIMATION_DURATION)
    expect(toJSON()).toMatchSnapshot()
  })
})
