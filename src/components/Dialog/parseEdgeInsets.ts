export interface EdgeInsets {
  top: number
  right: number
  bottom: number
  left: number
}

/**
 * Разбирает CSS-shorthand отступа ("top right bottom left") из v2-токена в
 * поэлементные значения для React Native, который не принимает такие строки.
 * Поддерживает 1/2/4-значные формы по правилам CSS.
 */
export const parseEdgeInsets = (padding: string | number): EdgeInsets => {
  const parts = String(padding).trim().split(/\s+/).map(Number)

  const [top = 0, right = top, bottom = top, left = right] = parts

  return { top, right, bottom, left }
}
