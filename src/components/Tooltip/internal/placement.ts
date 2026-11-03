import type { TooltipPosition } from '../types'

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export type Size = Pick<Rect, 'width' | 'height'>

interface GeometryOptions {
  anchor: Rect
  bounds: Rect
  size: Size
  position: TooltipPosition
  gutter: number
  arrowDepth: number
}

interface CoordinateOptions extends GeometryOptions {
  arrowWidth: number
  borderRadius: number
}

const opposite: Record<TooltipPosition, TooltipPosition> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max))

export const rectsIntersect = (bounds: Rect, anchor: Rect) =>
  anchor.x + anchor.width > bounds.x &&
  anchor.y + anchor.height > bounds.y &&
  anchor.x < bounds.x + bounds.width &&
  anchor.y < bounds.y + bounds.height

export const getTooltipBounds = (
  viewport: Size,
  insets: Record<'top' | 'bottom' | 'left' | 'right', number>,
  gutter: number
): Rect => ({
  x: insets.left + gutter,
  y: insets.top + gutter,
  width: viewport.width - insets.left - insets.right - 2 * gutter,
  height: viewport.height - insets.top - insets.bottom - 2 * gutter,
})

export const getTooltipPlacement = ({
  anchor,
  bounds,
  size,
  position,
  gutter,
  arrowDepth,
}: GeometryOptions) => {
  const space = {
    top: Math.max(0, anchor.y - bounds.y - gutter),
    bottom: Math.max(
      0,
      bounds.y + bounds.height - anchor.y - anchor.height - gutter
    ),
    left: Math.max(0, anchor.x - bounds.x - gutter),
    right: Math.max(
      0,
      bounds.x + bounds.width - anchor.x - anchor.width - gutter
    ),
  }
  const fits = (side: TooltipPosition) =>
    (side === 'top' || side === 'bottom' ? size.height : size.width) +
      arrowDepth <=
    space[side]
  let side = position

  if (!fits(side)) {
    side = fits(opposite[side])
      ? opposite[side]
      : (Object.keys(space) as TooltipPosition[]).reduce(
          (best, next) => (space[next] > space[best] ? next : best),
          side
        )
  }

  const vertical = side === 'top' || side === 'bottom'
  const maxWidth = Math.max(
    0,
    (vertical ? bounds.width : Math.min(bounds.width, space[side])) -
      (vertical ? 0 : arrowDepth)
  )
  const maxHeight = Math.max(
    0,
    (vertical ? Math.min(bounds.height, space[side]) : bounds.height) -
      (vertical ? arrowDepth : 0)
  )

  return { position: side, maxWidth, maxHeight }
}

export const getTooltipCoordinates = ({
  anchor,
  bounds,
  size,
  position,
  gutter,
  arrowDepth,
  arrowWidth,
  borderRadius,
}: CoordinateOptions) => {
  const vertical = position === 'top' || position === 'bottom'
  const width = size.width + (vertical ? 0 : arrowDepth)
  const height = size.height + (vertical ? arrowDepth : 0)
  const centerX = anchor.x + anchor.width / 2
  const centerY = anchor.y + anchor.height / 2
  let x = centerX - width / 2
  let y = centerY - height / 2

  switch (position) {
    case 'left':
      x = anchor.x - gutter - width
      break

    case 'right':
      x = anchor.x + anchor.width + gutter
      break

    case 'top':
      y = anchor.y - gutter - height
      break

    case 'bottom':
      y = anchor.y + anchor.height + gutter
      break
  }

  x = clamp(x, bounds.x, bounds.x + bounds.width - width)
  y = clamp(y, bounds.y, bounds.y + bounds.height - height)
  const edge = vertical ? width : height
  const inset = Math.min(borderRadius, Math.max(0, (edge - arrowWidth) / 2))
  const arrowOffset = clamp(
    (vertical ? centerX - x : centerY - y) - arrowWidth / 2,
    inset,
    edge - inset - arrowWidth
  )

  return { x, y, width, height, arrowOffset }
}
