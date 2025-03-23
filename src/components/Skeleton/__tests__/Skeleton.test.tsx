import { render } from '@testing-library/react-native'

import { ANIMATION_DURATION, Skeleton } from '../Skeleton'

describe('Skeleton', () => {
  beforeEach(() => {
    jest.useFakeTimers() // Включаем фейковые таймеры перед каждым тестом
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers() // Возвращаем реальное время после тестов
  })

  test('before animation started', () => {
    const { toJSON } = render(<Skeleton style={{ height: 50 }} />)

    expect(toJSON()).toMatchSnapshot('before animation started')
  })

  test('50% animation', () => {
    const { toJSON } = render(<Skeleton style={{ height: 50 }} />)

    jest.advanceTimersByTime(ANIMATION_DURATION / 2)

    expect(toJSON()).toMatchSnapshot()
  })

  test('100% animation', () => {
    const { toJSON } = render(<Skeleton style={{ height: 50 }} />)

    jest.advanceTimersByTime(ANIMATION_DURATION)

    expect(toJSON()).toMatchSnapshot()
  })
})
