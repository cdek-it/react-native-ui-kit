import { useEffect, useEffectEvent, useState } from 'react'
import {
  cancelAnimation,
  Easing,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export const useCountdown = (duration: number, onFinish?: () => void) => {
  const [remaining, setRemaining] = useState(duration)
  const progress = useSharedValue(1)
  const finish = useEffectEvent(() => onFinish?.())

  useEffect(() => {
    setRemaining(duration)
    progress.value = 1
    progress.value = withTiming(0, {
      duration: duration * 1000,
      easing: Easing.linear,
    })
    const startedAt = Date.now()
    const interval = setInterval(() => {
      setRemaining(
        Math.max(0, Math.ceil(duration - (Date.now() - startedAt) / 1000))
      )
    }, 1000)
    const timeout = setTimeout(() => {
      clearInterval(interval)
      setRemaining(0)
      finish()
    }, duration * 1000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
      cancelAnimation(progress)
    }
  }, [duration, progress])

  return { remaining, progress }
}
