import { act, cleanup, render } from '@testing-library/react-native'

import { Message, ToastMessage } from '..'

describe.each([
  { name: 'Message', Component: Message },
  { name: 'ToastMessage', Component: ToastMessage },
])('$name — таймер', ({ name, Component }) => {
  beforeEach(() => jest.useFakeTimers())

  afterEach(() => {
    cleanup()
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  test('завершает отсчёт один раз, не закрывая сообщение', () => {
    const onTimerFinish = jest.fn()
    const onClose = jest.fn()
    const screen = render(
      <Component
        timerValue={3}
        title='Сообщение'
        onClose={onClose}
        onTimerFinish={onTimerFinish}
      />
    )
    act(() => jest.advanceTimersByTime(2999))

    expect(onTimerFinish).not.toHaveBeenCalled()

    act(() => jest.advanceTimersByTime(1))

    expect(onTimerFinish).toHaveBeenCalledOnce()
    expect(onTimerFinish).toHaveBeenCalledWith()
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByText('Сообщение')).toBeOnTheScreen()

    act(() => jest.advanceTimersByTime(5000))

    expect(onTimerFinish).toHaveBeenCalledOnce()
  })

  test('использует актуальный callback без перезапуска отсчёта', () => {
    const first = jest.fn()
    const latest = jest.fn()
    const screen = render(
      <Component timerValue={3} title='Сообщение' onTimerFinish={first} />
    )
    act(() => jest.advanceTimersByTime(1000))
    screen.rerender(
      <Component timerValue={3} title='Сообщение' onTimerFinish={latest} />
    )
    act(() => jest.advanceTimersByTime(2000))

    expect(first).not.toHaveBeenCalled()
    expect(latest).toHaveBeenCalledOnce()

    const afterFinish = jest.fn()
    screen.rerender(
      <Component timerValue={3} title='Сообщение' onTimerFinish={afterFinish} />
    )
    act(() => jest.advanceTimersByTime(3000))

    expect(afterFinish).not.toHaveBeenCalled()
  })

  test('перезапускает отсчёт при изменении timerValue', () => {
    const onTimerFinish = jest.fn()
    const screen = render(
      <Component
        timerValue={3}
        title='Сообщение'
        onTimerFinish={onTimerFinish}
      />
    )
    act(() => jest.advanceTimersByTime(2000))
    screen.rerender(
      <Component
        timerValue={5}
        title='Сообщение'
        onTimerFinish={onTimerFinish}
      />
    )
    act(() => jest.advanceTimersByTime(3000))

    expect(onTimerFinish).not.toHaveBeenCalled()

    act(() => jest.advanceTimersByTime(2000))

    expect(onTimerFinish).toHaveBeenCalledOnce()
  })

  test('отменяет завершение при размонтировании', () => {
    const onTimerFinish = jest.fn()
    const screen = render(
      <Component
        timerValue={3}
        title='Сообщение'
        onTimerFinish={onTimerFinish}
      />
    )
    act(() => jest.advanceTimersByTime(1000))
    screen.unmount()
    act(() => jest.advanceTimersByTime(5000))

    expect(onTimerFinish).not.toHaveBeenCalled()
  })

  test('отменяет отсчёт при удалении timerValue', () => {
    const onTimerFinish = jest.fn()
    const screen = render(
      <Component
        timerValue={3}
        title='Сообщение'
        onTimerFinish={onTimerFinish}
      />
    )
    screen.rerender(
      <Component title='Сообщение' onTimerFinish={onTimerFinish} />
    )

    expect(
      screen.queryByTestId(`${name}Timer`, { includeHiddenElements: true })
    ).toBeNull()

    act(() => jest.advanceTimersByTime(5000))

    expect(onTimerFinish).not.toHaveBeenCalled()
  })

  test('исключает визуальный таймер из accessibility', () => {
    const screen = render(<Component timerValue={3} title='Сообщение' />)
    const timer = screen.getByTestId(`${name}Timer`, {
      includeHiddenElements: true,
    })

    expect(timer).toHaveProp('accessibilityElementsHidden', true)
    expect(timer).toHaveProp('importantForAccessibility', 'no-hide-descendants')
    expect(screen.queryByText('3')).toBeNull()
  })
})

describe('Визуальные варианты таймера', () => {
  beforeEach(() => jest.useFakeTimers())

  afterEach(() => {
    cleanup()
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  test('Message сохраняет иконку вместе с полосой без нижнего содержимого', () => {
    const screen = render(<Message timerValue={3} title='Сообщение' />)

    expect(
      screen.getByTestId('MessageIcon', { includeHiddenElements: true })
    ).toBeOnTheScreen()
    expect(
      screen.getByTestId('MessageTimer', { includeHiddenElements: true })
    ).toBeOnTheScreen()
    expect(screen.queryByTestId('MessageContent')).toBeNull()
  })

  test('ToastMessage заменяет иконку числовым отсчётом даже при hiddenIcon', () => {
    const screen = render(
      <ToastMessage hiddenIcon timerValue={3} title='Сообщение' />
    )

    expect(
      screen.queryByTestId('ToastMessageIcon', { includeHiddenElements: true })
    ).toBeNull()
    expect(
      screen.getByText('3', { includeHiddenElements: true })
    ).toBeOnTheScreen()

    act(() => jest.advanceTimersByTime(1000))

    expect(
      screen.getByText('2', { includeHiddenElements: true })
    ).toBeOnTheScreen()

    act(() => jest.advanceTimersByTime(2000))

    expect(
      screen.getByText('0', { includeHiddenElements: true })
    ).toBeOnTheScreen()
  })
})
