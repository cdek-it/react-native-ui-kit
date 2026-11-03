import {
  getTooltipBounds,
  getTooltipCoordinates,
  getTooltipPlacement,
  rectsIntersect,
} from '../internal/placement'
import type { TooltipPosition } from '../types'

const bounds = { x: 12, y: 40, width: 336, height: 680 }
const anchor = { x: 150, y: 350, width: 60, height: 40 }
const size = { width: 100, height: 50 }
const options = {
  bounds,
  anchor,
  size,
  gutter: 4,
  arrowDepth: 3.5,
  arrowWidth: 7,
  borderRadius: 8,
}

const placeTooltip = (
  input: typeof options & { position: TooltipPosition }
) => {
  const placement = getTooltipPlacement(input)
  const size = {
    width: Math.min(input.size.width, placement.maxWidth),
    height: Math.min(input.size.height, placement.maxHeight),
  }

  return {
    ...placement,
    ...getTooltipCoordinates({ ...input, position: placement.position, size }),
  }
}

describe('Tooltip — размещение', () => {
  test.each(['top', 'bottom', 'left', 'right'] as const)(
    'сохраняет сторону %s при достаточном месте',
    (position) => {
      expect(placeTooltip({ ...options, position }).position).toBe(position)
    }
  )

  test.each([
    {
      name: 'сверху',
      position: 'top',
      anchor: { ...anchor, y: 40 },
      expected: 'bottom',
    },
    {
      name: 'снизу',
      position: 'bottom',
      anchor: { ...anchor, y: 680 },
      expected: 'top',
    },
    {
      name: 'слева',
      position: 'left',
      anchor: { ...anchor, x: 12 },
      expected: 'right',
    },
    {
      name: 'справа',
      position: 'right',
      anchor: { ...anchor, x: 288 },
      expected: 'left',
    },
  ] as const)(
    'переворачивает подсказку у края $name',
    ({ position, anchor, expected }) => {
      expect(placeTooltip({ ...options, position, anchor }).position).toBe(
        expected
      )
    }
  )

  test.each([
    { name: 'левый верхний', x: 12, y: 40 },
    { name: 'правый верхний', x: 288, y: 40 },
    { name: 'левый нижний', x: 12, y: 680 },
    { name: 'правый нижний', x: 288, y: 680 },
  ])('удерживает карточку и стрелку внутри границ: $name угол', ({ x, y }) => {
    const layout = placeTooltip({
      ...options,
      position: 'top',
      anchor: { ...anchor, x, y },
    })

    expect(layout.x).toBeGreaterThanOrEqual(bounds.x)
    expect(layout.y).toBeGreaterThanOrEqual(bounds.y)
    expect(layout.x + layout.width).toBeLessThanOrEqual(bounds.x + bounds.width)
    expect(layout.y + layout.height).toBeLessThanOrEqual(
      bounds.y + bounds.height
    )
    expect(layout.arrowOffset).toBeGreaterThanOrEqual(8)
    expect(layout.arrowOffset + 7).toBeLessThanOrEqual(layout.width - 8)
  })

  test('выбирает доступную сторону и ограничивает огромный текст', () => {
    const layout = placeTooltip({
      ...options,
      position: 'left',
      size: { width: 1000, height: 2000 },
    })

    expect(layout.position).toBe('bottom')
    expect(layout.width).toBeLessThanOrEqual(bounds.width)
    expect(layout.height).toBeLessThanOrEqual(bounds.height)
    expect(layout.y + layout.height).toBeLessThanOrEqual(
      bounds.y + bounds.height
    )
  })

  test('учитывает изменившуюся безопасную область', () => {
    const nextBounds = { x: 30, y: 70, width: 200, height: 250 }
    const layout = placeTooltip({
      ...options,
      position: 'right',
      bounds: nextBounds,
    })

    expect(layout.x).toBeGreaterThanOrEqual(nextBounds.x)
    expect(layout.y).toBeGreaterThanOrEqual(nextBounds.y)
    expect(layout.x + layout.width).toBeLessThanOrEqual(230)
    expect(layout.y + layout.height).toBeLessThanOrEqual(320)
  })

  test('отнимает safe area и отступ от размеров viewport', () => {
    expect(
      getTooltipBounds(
        { width: 360, height: 740 },
        { top: 36, bottom: 16, left: 8, right: 8 },
        4
      )
    ).toStrictEqual({ x: 12, y: 40, width: 336, height: 680 })
  })

  test('отличает видимый якорь от полностью скрытого за краем', () => {
    expect(rectsIntersect(bounds, anchor)).toBeTrue()
    expect(rectsIntersect(bounds, { ...anchor, y: 800 })).toBeFalse()
    expect(rectsIntersect(bounds, { ...anchor, x: -100 })).toBeFalse()
  })
})
