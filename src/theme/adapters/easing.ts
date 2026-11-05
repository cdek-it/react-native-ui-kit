import { Easing, type EasingFunctionFactory } from 'react-native-reanimated'

export interface EasingToken {
  readonly x1: number
  readonly y1: number
  readonly x2: number
  readonly y2: number
}

export const toEasing = ({
  x1,
  y1,
  x2,
  y2,
}: EasingToken): EasingFunctionFactory => Easing.bezier(x1, y1, x2, y2)
