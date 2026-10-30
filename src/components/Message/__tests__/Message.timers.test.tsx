import { act, render, screen } from '@testing-library/react-native'

import { Message } from '../Message'
import { TestId } from '../testIds'

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
