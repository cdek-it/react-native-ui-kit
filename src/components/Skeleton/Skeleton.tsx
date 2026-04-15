import { memo, useCallback, useContext, useEffect, useRef } from 'react'
import { View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'
import type { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

import { StyleSheet, useUnistyles } from '../../utils'
import { SkeletonContext } from '../../utils/SkeletonContext'

interface SkeletonProps extends ViewProps {}

/**
 * Используется для отображения контента в момент загрузки
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=5241-3731
 */
export const Skeleton = memo<SkeletonProps>(({ style, testID, ...rest }) => {
  const {
    globalTranslateX,
    registerSkeleton,
    unregisterSkeleton,
    skeletonWidth,
  } = useContext(SkeletonContext)
  const {
    theme: {
      theme: { Misc },
    },
  } = useUnistyles()

  const skeletonRef = useRef<View>(null)
  const skeletonX = useSharedValue(0)

  const onLayout = useCallback(() => {
    skeletonRef.current?.measure((_x, _y, _width, _height, pageX) => {
      skeletonX.value = pageX
    })
  }, [skeletonX])

  useEffect(() => {
    registerSkeleton()

    return unregisterSkeleton
  }, [registerSkeleton, unregisterSkeleton])

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: globalTranslateX.value - skeletonX.value }],
  }))

  return (
    <View
      {...rest}
      ref={skeletonRef}
      style={[styles.container, style]}
      testID={testID ?? SkeletonTestId.root}
      onLayout={onLayout}
    >
      <Animated.View
        style={[
          styles.gradientContainer,
          { width: skeletonWidth },
          animatedStyles,
        ]}
        testID={SkeletonTestId.animatedView}
      >
        <Svg testID={SkeletonTestId.svg}>
          <Defs>
            <LinearGradient id='gradient' x1='0' x2='1' y1='1' y2='1'>
              <Stop
                offset='0'
                stopColor={Misc.Skeleton.skeletonBg}
                stopOpacity='0.4'
              />
              <Stop
                offset='0.5'
                stopColor={Misc.Skeleton.skeletonAnimationBg}
                stopOpacity='0.4'
              />
              <Stop
                offset='1'
                stopColor={Misc.Skeleton.skeletonBg}
                stopOpacity='0.4'
              />
            </LinearGradient>
          </Defs>
          <Rect fill='url(#gradient)' height='100%' width='100%' />
        </Svg>
      </Animated.View>
    </View>
  )
})

const styles = StyleSheet.create(({ border, theme }) => ({
  container: {
    borderRadius: border.Radius['rounded-lg'],
    overflow: 'hidden',
    backgroundColor: theme.Misc.Skeleton.skeletonBg,
  },
  gradientContainer: { position: 'absolute', height: '100%' },
}))

export const SkeletonTestId = {
  root: 'Skeleton',
  animatedView: 'Skeleton.animatedView',
  svg: 'Skeleton.svg',
}
