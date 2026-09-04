import { toEasing } from '../easing'

describe('toEasing', () => {
  test('создаёт Reanimated easing из коэффициентов токена', () => {
    const easing = toEasing({ x1: 0, y1: 0, x2: 1, y2: 1 }).factory()

    expect(easing(0)).toBe(0)
    expect(easing(0.5)).toBeCloseTo(0.5)
    expect(easing(1)).toBe(1)
  })
})
