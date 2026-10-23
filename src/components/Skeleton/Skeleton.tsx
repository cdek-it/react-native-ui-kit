import { memo, useCallback, useContext, useEffect, useRef } from 'react'
import { View, type ViewProps } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

import { StyleSheet } from 'react-native-unistyles'

import { SkeletonContext } from '../../utils/SkeletonContext'

export interface SkeletonProps extends Omit<ViewProps, 'onLayout'> {}

/**
 * Используется для отображения контента в момент загрузки
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=5221-12465
 */
export const Skeleton = memo<SkeletonProps>(({ style, testID, ...rest }) => {
  const {
    globalTranslateX,
    registerSkeleton,
    unregisterSkeleton,
    skeletonWidth,
  } = useContext(SkeletonContext)

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
      accessible={false}
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
        <Svg accessible={false} testID={SkeletonTestId.svg}>
          <Defs>
            <LinearGradient id='gradient' x1='0' x2='1' y1='1' y2='1'>
              <Stop
                offset='0'
                stopColor={styles.container.backgroundColor}
                stopOpacity='0.4'
              />
              <Stop
                offset='0.5'
                stopColor={styles.gradientColor.backgroundColor}
                stopOpacity='0.4'
              />
              <Stop
                offset='1'
                stopColor={styles.container.backgroundColor}
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

const styles = StyleSheet.create(({ components: { skeleton } }) => ({
  container: {
    borderRadius: skeleton.root.borderRadius,
    overflow: 'hidden',
    backgroundColor: skeleton.colorScheme.root.background,
  },
  gradientContainer: { position: 'absolute', height: '100%' },
  gradientColor: {
    backgroundColor: skeleton.colorScheme.root.animationBackground,
  },
}))

export const SkeletonTestId = {
  root: 'Skeleton',
  animatedView: 'Skeleton.animatedView',
  svg: 'Skeleton.svg',
}
