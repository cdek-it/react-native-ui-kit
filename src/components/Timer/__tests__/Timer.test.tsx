import { act, render } from '@testing-library/react-native'
import React from 'react'

import { Timer } from '../Timer'

describe('Timer', () => {
  test('snapshot', () => {
    jest.useFakeTimers()
    const { toJSON } = render(<Timer countFrom={2} />)

    expect(toJSON()).toMatchSnapshot('before start')

    act(() => {
      jest.advanceTimersByTime(1000)
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(toJSON()).toMatchSnapshot('on finish')
  })

  test('should reset timer on changing countFrom prop', () => {
    jest.useFakeTimers()
    const { rerender, toJSON } = render(<Timer countFrom={5} />)

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(toJSON()).toMatchSnapshot('after 1 s')

    rerender(<Timer countFrom={10} />)
    expect(toJSON()).toMatchSnapshot('after reset')
  })

  test('should handle onFinish', () => {
    jest.useFakeTimers()
    const mockedOnFinish = jest.fn()
    render(<Timer countFrom={1} onFinish={mockedOnFinish} />)

    expect(mockedOnFinish).not.toHaveBeenCalled()
    act(() => {
      jest.runAllTimers()
    })
    expect(mockedOnFinish).toHaveBeenCalled()
  })

  test('should NOT call onFinish until the timer expires', () => {
    jest.useFakeTimers()
    const mockedOnFinish = jest.fn()
    const { unmount } = render(<Timer countFrom={1} onFinish={mockedOnFinish} />)

    expect(mockedOnFinish).not.toHaveBeenCalled()
    unmount()
    jest.runAllTimers()
    expect(mockedOnFinish).not.toHaveBeenCalled()
  })

  test('should clear timeout on unmount', () => {
    jest.useFakeTimers()
    const mockedClearTimeout = jest.spyOn(global, 'clearTimeout')
    const { unmount } = render(<Timer countFrom={1} />)
    unmount()

    expect(mockedClearTimeout).toHaveBeenCalledTimes(1)
  })
})
