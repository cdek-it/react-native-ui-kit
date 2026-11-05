import '@testing-library/react-native/build/matchers/extend-expect'
import {
  act,
  cleanupAsync,
  render,
  type RenderResult,
} from '@testing-library/react-native/pure'
import { AccessibilityInfo, Pressable } from 'react-native'
import { cancelAnimation } from 'react-native-reanimated'
import { Circle } from 'react-native-svg'

import { ProgressSpinner } from '../ProgressSpinner'

jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('react-native-reanimated')

  return { ...actual, cancelAnimation: jest.fn(actual.cancelAnimation) }
})

const motionAccessibility: {
  addEventListener: (
    event: 'reduceMotionChanged',
    handler: (enabled: boolean) => void
  ) => { remove: () => void }
} = AccessibilityInfo

describe('ProgressSpinner', () => {
  let emitMotion: (enabled: boolean) => void
  let resolveMotion: (enabled: boolean) => void
  let rejectMotion: (error: Error) => void
  let removeListener: jest.Mock

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    removeListener = jest.fn()
    jest
      .spyOn(motionAccessibility, 'addEventListener')
      .mockImplementation((_event, handler) => {
        emitMotion = handler

        return { remove: removeListener }
      })
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockImplementation(
      () =>
        new Promise<boolean>((resolve, reject) => {
          resolveMotion = resolve
          rejectMotion = reject
        })
    )
  })

  afterEach(async () => {
    await cleanupAsync()
    jest.clearAllTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  const advance = (ms: number) => {
    act(() => {
      jest.advanceTimersByTime(ms)
    })
  }
  const circumference = 28 * Math.PI
  const animatedArc = (screen: RenderResult) =>
    screen.UNSAFE_getByType(Circle).props.jestAnimatedProps.value as {
      strokeDasharray: number[]
      strokeDashoffset: number
    }
  const expectStatic = (screen: RenderResult) => {
    expect(animatedArc(screen).strokeDasharray[0]).toBeCloseTo(
      circumference / 2
    )
    expect(animatedArc(screen).strokeDashoffset).toBe(0)
    expect(screen.getByTestId('ProgressSpinner')).toHaveAnimatedStyle({
      transform: [{ rotate: '0deg' }],
    })
  }

  test('объявляет загрузку и сохраняет остальные accessibility состояния', () => {
    const screen = render(
      <ProgressSpinner
        accessibilityLabel='Загрузка'
        accessibilityState={{ busy: false, disabled: true, selected: true }}
      />
    )

    expect(
      screen.getByRole('progressbar', { name: 'Загрузка', busy: true }).props
        .accessibilityState
    ).toStrictEqual({ busy: true, disabled: true, selected: true })

    screen.rerender(
      <ProgressSpinner
        accessibilityLabel='Загрузка'
        accessibilityState={{ expanded: true, checked: true }}
      />
    )

    expect(
      screen.getByRole('progressbar').props.accessibilityState
    ).toStrictEqual({ busy: true, expanded: true, checked: true })
    expect(
      screen.getByRole('progressbar').props.accessibilityState.disabled
    ).toBeUndefined()
  })

  test('оставляет доступным только загружающий родительский Pressable', () => {
    const screen = render(
      <Pressable
        accessibilityLabel='Загрузить'
        accessibilityRole='button'
        accessibilityState={{ busy: true }}
      >
        <ProgressSpinner accessible={false} />
      </Pressable>
    )

    expect(
      screen.getByRole('button', { name: 'Загрузить', busy: true })
    ).toBeTruthy()
    expect(screen.queryByRole('progressbar')).toBeNull()
  })

  test('сохраняет явно заданную роль', () => {
    const screen = render(
      <ProgressSpinner
        accessibilityLabel='Ожидание'
        accessibilityRole='image'
      />
    )

    expect(screen.getByRole('image', { name: 'Ожидание' })).toBeTruthy()
  })

  test('наращивает и смещает дугу с повторением исходного цикла', async () => {
    const screen = render(<ProgressSpinner />)
    await act(async () => resolveMotion(false))
    advance(0)

    expect(animatedArc(screen).strokeDasharray[0]).toBeCloseTo(1)

    // Допускаем сдвиг на один кадр при 60 fps, включая границы повторения.
    const tolerance = (circumference * 4 * (1000 / 60)) / 1500
    advance(750)

    const waxing = animatedArc(screen)

    expect(
      Math.abs(waxing.strokeDasharray[0] - 0.7 * circumference)
    ).toBeLessThan(tolerance)
    expect(
      Math.abs(waxing.strokeDashoffset + 0.3 * circumference)
    ).toBeLessThan(tolerance)
    expect(waxing.strokeDasharray[1]).toBeCloseTo(circumference)

    advance(500)

    const extended = animatedArc(screen)

    expect(extended.strokeDasharray[0]).toBeGreaterThan(
      waxing.strokeDasharray[0]
    )
    expect(extended.strokeDashoffset).toBeLessThan(waxing.strokeDashoffset)

    advance(1000)

    const repeated = animatedArc(screen)

    expect(
      Math.abs(repeated.strokeDasharray[0] - 0.7 * circumference)
    ).toBeLessThan(tolerance)
    expect(
      Math.abs(repeated.strokeDashoffset + 0.3 * circumference)
    ).toBeLessThan(tolerance)

    expect(screen.getByTestId('ProgressSpinner')).not.toHaveAnimatedStyle({
      transform: [{ rotate: '0deg' }],
    })
  })

  test('анимируется до ответа системы, останавливается при Reduce Motion и перезапускается по событию', async () => {
    const screen = render(<ProgressSpinner />)
    advance(750)

    expect(screen.getByTestId('ProgressSpinner')).not.toHaveAnimatedStyle({
      transform: [{ rotate: '0deg' }],
    })

    await act(async () => resolveMotion(true))
    advance(750)
    expectStatic(screen)
    act(() => emitMotion(false))
    advance(0)

    expect(animatedArc(screen).strokeDasharray[0]).toBeCloseTo(1)

    advance(400)

    expect(animatedArc(screen).strokeDasharray[0]).toBeGreaterThan(1)

    act(() => emitMotion(true))
    advance(0)
    expectStatic(screen)
    advance(750)
    expectStatic(screen)
    act(() => emitMotion(false))
    advance(0)

    expect(animatedArc(screen).strokeDasharray[0]).toBeCloseTo(1)

    advance(400)

    expect(animatedArc(screen).strokeDasharray[0]).toBeGreaterThan(1)
  })

  test('событие имеет приоритет перед устаревшим ответом initial query', async () => {
    const screen = render(<ProgressSpinner />)
    act(() => emitMotion(true))
    await act(async () => resolveMotion(false))
    advance(1000)
    expectStatic(screen)
  })

  test('ошибка запроса сохраняет анимацию до события Reduce Motion', async () => {
    const screen = render(<ProgressSpinner />)
    await act(async () => rejectMotion(new Error('Unavailable')))
    advance(400)

    expect(animatedArc(screen).strokeDasharray[0]).toBeGreaterThan(1)
    expect(screen.getByTestId('ProgressSpinner')).not.toHaveAnimatedStyle({
      transform: [{ rotate: '0deg' }],
    })

    act(() => emitMotion(true))
    advance(400)

    expectStatic(screen)
  })

  test.each([
    { name: 'resolve', reject: false },
    { name: 'reject', reject: true },
  ])(
    'снимает подписку и игнорирует поздний $name после unmount',
    async ({ reject }) => {
      const screen = render(<ProgressSpinner />)
      const lateResolve = resolveMotion
      const lateReject = rejectMotion
      screen.unmount()

      expect(removeListener).toHaveBeenCalledOnce()

      await act(async () => {
        if (reject) {
          lateReject(new Error('Unmounted'))
        } else {
          lateResolve(false)
        }
      })
      const fresh = render(<ProgressSpinner />)

      expect(AccessibilityInfo.isReduceMotionEnabled).toHaveBeenCalledTimes(2)

      await act(async () => resolveMotion(true))
      advance(750)
      expectStatic(fresh)
    }
  )

  test('отменяет оба разных цикла при переключении настройки и unmount', async () => {
    const cancel = jest.mocked(cancelAnimation)
    const screen = render(<ProgressSpinner />)
    await act(async () => resolveMotion(false))
    cancel.mockClear()
    act(() => emitMotion(true))

    expect(cancel).toHaveBeenCalledTimes(2)
    expect(cancel.mock.calls[0][0]).not.toBe(cancel.mock.calls[1][0])

    act(() => emitMotion(false))
    cancel.mockClear()
    screen.unmount()

    expect(cancel).toHaveBeenCalledTimes(2)
    expect(cancel.mock.calls[0][0]).not.toBe(cancel.mock.calls[1][0])
  })
})
