import { act, render, screen, within } from '@testing-library/react-native'

import { Message } from '../Message'
import { TestId, TimerTestId } from '../testIds'

describe('Message: таймер', () => {
  beforeEach(() => jest.useFakeTimers())

  afterEach(() => jest.useRealTimers())

  test('показывает декоративный таймер вместо скрытой иконки', () => {
    render(<Message hiddenIcon timerValue={2} title='Сообщение' />)

    expect(
      screen.getByTestId('TimerContainer', { includeHiddenElements: true })
    ).toBeOnTheScreen()
    expect(
      screen.queryByTestId(TestId.Icon, { includeHiddenElements: true })
    ).toBeNull()
    expect(screen.queryByTestId('TimerContainer')).toBeNull()
  })

  test('возвращает иконку при выключении таймера', () => {
    const { rerender } = render(<Message timerValue={2} title='Сообщение' />)
    rerender(<Message timerValue={0} title='Сообщение' />)

    expect(
      screen.queryByTestId('TimerContainer', { includeHiddenElements: true })
    ).toBeNull()
    expect(
      screen.getByTestId(TestId.Icon, { includeHiddenElements: true })
    ).toBeOnTheScreen()
  })

  test('по завершении вызывает callback однократно и оставляет сообщение', () => {
    const onTimerFinish = jest.fn()
    render(
      <Message timerValue={2} title='Сообщение' onTimerFinish={onTimerFinish} />
    )
    act(() => jest.advanceTimersByTime(1999))

    expect(onTimerFinish).not.toHaveBeenCalled()

    act(() => jest.advanceTimersByTime(1))

    expect(onTimerFinish).toHaveBeenCalledExactlyOnceWith()

    act(() => jest.advanceTimersByTime(5000))

    expect(onTimerFinish).toHaveBeenCalledOnce()
    expect(screen.getByText('Сообщение')).toBeOnTheScreen()
  })

  test('не перезапускает отсчёт при изменении severity', () => {
    const onTimerFinish = jest.fn()
    const { rerender } = render(
      <Message
        severity='info'
        timerValue={2}
        title='Сообщение'
        onTimerFinish={onTimerFinish}
      />
    )
    act(() => jest.advanceTimersByTime(500))
    rerender(
      <Message
        severity='danger'
        timerValue={2}
        title='Сообщение'
        onTimerFinish={onTimerFinish}
      />
    )
    act(() => jest.advanceTimersByTime(1500))

    expect(onTimerFinish).toHaveBeenCalledExactlyOnceWith()
  })

  test('восстанавливает цифру при перезапуске во время перехода к следующему значению', () => {
    const { rerender } = render(<Message timerValue={5} title='Сообщение' />)

    for (let second = 0; second < 3; second += 1) {
      act(() => jest.advanceTimersByTime(1000))
    }

    act(() => jest.advanceTimersByTime(100))
    rerender(<Message timerValue={3} title='Сообщение' />)
    act(() => jest.advanceTimersByTime(500))

    const currentValue = screen.getByTestId(TimerTestId.CurrentValue, {
      includeHiddenElements: true,
    })

    expect(
      within(currentValue).getByText('3', { includeHiddenElements: true })
    ).toBeOnTheScreen()
    expect(currentValue).toHaveAnimatedStyle({
      opacity: 1,
      transform: [{ translateY: 0 }],
    })
  })

  test('отменяет завершение после выключения таймера', () => {
    const onTimerFinish = jest.fn()
    const { rerender } = render(
      <Message timerValue={2} title='Сообщение' onTimerFinish={onTimerFinish} />
    )
    act(() => jest.advanceTimersByTime(1000))
    rerender(<Message title='Сообщение' onTimerFinish={onTimerFinish} />)
    act(() => jest.advanceTimersByTime(5000))

    expect(onTimerFinish).not.toHaveBeenCalled()
  })
})
