import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useWindowDimensions } from 'react-native'
import {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
  useDerivedValue,
  interpolate,
} from 'react-native-reanimated'

interface SkeletonContextType {
  globalTranslateX: Readonly<SharedValue<number>>
  registerSkeleton: () => void
  unregisterSkeleton: () => void
  skeletonWidth: number
}

const emptyFunc = () => {
  /** Empty */
}

const defaultSkeletonContext: SkeletonContextType = {
  globalTranslateX: {
    value: 0,
    addListener: emptyFunc,
    removeListener: emptyFunc,
    set: emptyFunc,
    get: () => 0,
    modify: emptyFunc,
  },
  registerSkeleton: emptyFunc,
  unregisterSkeleton: emptyFunc,
  skeletonWidth: 0,
}

export const SkeletonContext = createContext(defaultSkeletonContext)

interface SkeletonContextProviderProps {
  readonly children: ReactNode
}

export const SKELETON_ANIMATION_DURATION = 1200

export const SkeletonContextProvider = ({
  children,
}: SkeletonContextProviderProps) => {
  const [skeletons, setSkeletons] = useState(0)
  const runningAnimation = useRef(false)
  const skeletonAnimation = useSharedValue(0)
  const { width: screenWidth } = useWindowDimensions()

  const globalTranslateX = useDerivedValue(() =>
    interpolate(skeletonAnimation.value, [0, 1], [-screenWidth, screenWidth])
  )

  const registerSkeleton = useCallback(() => {
    setSkeletons((current) => current + 1)
  }, [])

  const unregisterSkeleton = useCallback(() => {
    setSkeletons((current) => (current > 0 ? current - 1 : 0))
  }, [])

  useEffect(() => {
    if (skeletons > 0 && !runningAnimation.current) {
      skeletonAnimation.value = withRepeat(
        withTiming(1, {
          duration: SKELETON_ANIMATION_DURATION,
          easing: Easing.ease,
        }),
        -1
      )
      runningAnimation.current = true
    } else if (skeletons === 0 && runningAnimation.current) {
      skeletonAnimation.value = 0
      runningAnimation.current = false
    }
  }, [skeletonAnimation, skeletons])

  const contextValue = useMemo<SkeletonContextType>(
    () => ({
      globalTranslateX,
      registerSkeleton,
      unregisterSkeleton,
      skeletonWidth: screenWidth,
    }),
    [globalTranslateX, registerSkeleton, unregisterSkeleton, screenWidth]
  )

  return (
    <SkeletonContext.Provider value={contextValue}>
      {children}
    </SkeletonContext.Provider>
  )
}
