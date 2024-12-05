import { useEffect } from 'react'
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

const DURATION = 1000 // ms

export const useLoadingRotationAnimation = (loading?: boolean) => {
  const loadingAnimation = useSharedValue(0)

  useEffect(() => {
    loadingAnimation.value = loading
      ? withRepeat(withTiming(1, { duration: DURATION, easing: Easing.inOut(Easing.ease) }), -1)
      : 0
  }, [loading, loadingAnimation])

  return useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(loadingAnimation.value, [0, 1], [0, 360])}deg`,
      },
    ],
  }))
}
