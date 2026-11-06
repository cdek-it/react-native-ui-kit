import {
  act,
  cleanupAsync,
  render,
  screen,
} from '@testing-library/react-native'
import { Text } from 'react-native'
import type { cancelAnimation } from 'react-native-reanimated'

import { Dialog, DialogTestId } from '../Dialog'

jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual<{
    cancelAnimation: typeof cancelAnimation
  }>('react-native-reanimated')

  return {
    __esModule: true,
    ...actual,
    // Native отмена выполняется в отдельной очереди после назначения новой анимации.
    cancelAnimation: (value: Parameters<typeof actual.cancelAnimation>[0]) => {
      queueMicrotask(() => actual.cancelAnimation(value))
    },
  }
})

const advance = async (milliseconds: number) => {
  await act(async () => {
    jest.advanceTimersByTime(milliseconds)
  })
}

describe('Dialog animation', () => {
  beforeEach(() => jest.useFakeTimers({ doNotFake: ['queueMicrotask'] }))

  afterEach(async () => {
    await cleanupAsync()
    await act(async () => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  test('завершает открытие после скрытого состояния при асинхронной отмене native-анимаций', async () => {
    const { rerender } = render(<Dialog visible={false} />)
    await advance(0)
    rerender(<Dialog visible />)
    await advance(0)
    await advance(600)

    expect(
      screen.getByTestId(DialogTestId.contentContainer)
    ).toHaveAnimatedStyle({ opacity: 1, transform: [{ scale: 1 }] })
  })

  test('не вызывает onHideComplete для изначально скрытого окна', async () => {
    const onHideComplete = jest.fn()
    render(<Dialog visible={false} onHideComplete={onHideComplete} />)
    await advance(600)

    expect(onHideComplete).not.toHaveBeenCalled()
  })

  test('сохраняет содержимое до окончания закрытия и вызывает callback один раз', async () => {
    const onHideComplete = jest.fn()
    const { rerender } = render(
      <Dialog visible onHideComplete={onHideComplete}>
        <Text>Содержимое</Text>
      </Dialog>
    )
    await advance(600)
    rerender(
      <Dialog visible={false} onHideComplete={onHideComplete}>
        <Text>Содержимое</Text>
      </Dialog>
    )
    await advance(100)

    expect(screen.getByText('Содержимое')).toBeOnTheScreen()
    expect(onHideComplete).not.toHaveBeenCalled()

    await advance(200)

    expect(screen.queryByText('Содержимое')).not.toBeOnTheScreen()
    expect(onHideComplete).toHaveBeenCalledExactlyOnceWith()

    await advance(1000)

    expect(onHideComplete).toHaveBeenCalledOnce()
  })

  test('повторное открытие отменяет callback незавершённого закрытия', async () => {
    const onHideComplete = jest.fn()
    const { rerender } = render(
      <Dialog visible onHideComplete={onHideComplete}>
        <Text>Содержимое</Text>
      </Dialog>
    )
    await advance(600)
    rerender(
      <Dialog visible={false} onHideComplete={onHideComplete}>
        <Text>Содержимое</Text>
      </Dialog>
    )
    await advance(100)
    rerender(
      <Dialog visible onHideComplete={onHideComplete}>
        <Text>Содержимое</Text>
      </Dialog>
    )
    await advance(600)

    expect(screen.getByText('Содержимое')).toBeOnTheScreen()
    expect(onHideComplete).not.toHaveBeenCalled()

    rerender(<Dialog visible={false} onHideComplete={onHideComplete} />)
    await advance(300)

    expect(onHideComplete).toHaveBeenCalledExactlyOnceWith()
  })

  test('закрывает окно, если visible изменился до окончания открытия', async () => {
    const onHideComplete = jest.fn()
    const { rerender } = render(
      <Dialog visible onHideComplete={onHideComplete}>
        <Text>Содержимое</Text>
      </Dialog>
    )
    await advance(100)
    rerender(
      <Dialog visible={false} onHideComplete={onHideComplete}>
        <Text>Содержимое</Text>
      </Dialog>
    )
    await advance(300)

    expect(screen.queryByText('Содержимое')).not.toBeOnTheScreen()
    expect(onHideComplete).toHaveBeenCalledExactlyOnceWith()
  })

  test('смена callback не перезапускает закрытие и использует актуальный обработчик', async () => {
    const previous = jest.fn()
    const current = jest.fn()
    const { rerender } = render(<Dialog visible onHideComplete={previous} />)
    await advance(600)
    rerender(<Dialog visible={false} onHideComplete={previous} />)
    await advance(100)
    rerender(<Dialog visible={false} onHideComplete={current} />)
    await advance(150)

    expect(previous).not.toHaveBeenCalled()
    expect(current).toHaveBeenCalledExactlyOnceWith()
  })

  test('размонтирование отменяет callback закрытия', async () => {
    const onHideComplete = jest.fn()
    const { rerender, unmount } = render(
      <Dialog visible onHideComplete={onHideComplete} />
    )
    await advance(600)
    rerender(<Dialog visible={false} onHideComplete={onHideComplete} />)
    await advance(100)
    unmount()
    await advance(600)

    expect(onHideComplete).not.toHaveBeenCalled()
  })
})
