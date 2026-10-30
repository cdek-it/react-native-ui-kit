import { act, render, screen } from '@testing-library/react-native'

import { Timer } from '../internal/Timer'

describe('Timer', () => {
  beforeEach(() => jest.useFakeTimers())

  afterEach(() => jest.useRealTimers())

  test('показывает оставшиеся секунды и завершает отсчёт в заданный момент', () => {
    const onFinish = jest.fn()
    render(<Timer countFrom={2} onFinish={onFinish} />)

    expect(
      screen.getAllByText('2', { includeHiddenElements: true }).length
    ).toBeGreaterThan(0)

    act(() => jest.advanceTimersByTime(1000))

    expect(
      screen.getAllByText('1', { includeHiddenElements: true }).length
    ).toBeGreaterThan(0)
    expect(onFinish).not.toHaveBeenCalled()

    act(() => jest.advanceTimersByTime(1000))

    expect(onFinish).toHaveBeenCalledExactlyOnceWith()
  })

  test('перезапускает отсчёт при изменении длительности и отменяет старое завершение', () => {
    const onFinish = jest.fn()
    const { rerender } = render(<Timer countFrom={2} onFinish={onFinish} />)
    act(() => jest.advanceTimersByTime(1500))
    rerender(<Timer countFrom={3} onFinish={onFinish} />)
    act(() => jest.advanceTimersByTime(2999))

    expect(onFinish).not.toHaveBeenCalled()

    act(() => jest.advanceTimersByTime(1))

    expect(onFinish).toHaveBeenCalledOnce()
  })

  test('перезапускает отсчёт, когда новая длительность совпадает с оставшимися секундами', () => {
    const onFinish = jest.fn()
    const { rerender } = render(<Timer countFrom={3} onFinish={onFinish} />)
    act(() => jest.advanceTimersByTime(1500))
    rerender(<Timer countFrom={2} onFinish={onFinish} />)
    act(() => jest.advanceTimersByTime(1999))

    expect(onFinish).not.toHaveBeenCalled()

    act(() => jest.advanceTimersByTime(1))

    expect(onFinish).toHaveBeenCalledExactlyOnceWith()
  })

  test('не сдвигает завершение при смене callback и вызывает актуальный обработчик', () => {
    const first = jest.fn()
    const latest = jest.fn()
    const { rerender } = render(<Timer countFrom={2} onFinish={first} />)
    act(() => jest.advanceTimersByTime(500))
    rerender(<Timer countFrom={2} onFinish={latest} />)
    act(() => jest.advanceTimersByTime(1500))

    expect(first).not.toHaveBeenCalled()
    expect(latest).toHaveBeenCalledExactlyOnceWith()
  })

  test('не повторяет завершение при смене callback после окончания отсчёта', () => {
    const first = jest.fn()
    const latest = jest.fn()
    const { rerender } = render(<Timer countFrom={1} onFinish={first} />)
    act(() => jest.advanceTimersByTime(1000))

    expect(first).toHaveBeenCalledOnce()

    rerender(<Timer countFrom={1} onFinish={latest} />)
    act(() => jest.advanceTimersByTime(5000))

    expect(first).toHaveBeenCalledOnce()
    expect(latest).not.toHaveBeenCalled()
  })

  test('отменяет завершение при размонтировании', () => {
    const onFinish = jest.fn()
    const { unmount } = render(<Timer countFrom={3} onFinish={onFinish} />)
    act(() => jest.advanceTimersByTime(500))
    unmount()
    act(() => jest.advanceTimersByTime(5000))

    expect(onFinish).not.toHaveBeenCalled()
  })
})
