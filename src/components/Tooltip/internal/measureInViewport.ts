import type { View } from 'react-native'

import type { Rect } from './placement'

export const measureInViewport = (
  view: View,
  onMeasure: (rect: Rect) => void
) => {
  view.measure((...[, , width, height, x, y]) =>
    onMeasure({ x, y, width, height })
  )
}
