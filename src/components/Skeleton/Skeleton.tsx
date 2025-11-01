import { memo, useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'
import type { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

import { makeStyles } from '../../utils/makeStyles'

interface SkeletonProps extends ViewProps {}

export const ANIMATION_DURATION = 1200 // ms

/**
 * Используется для отображения контента в момент загрузки
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=5241-3731
 */
export const Skeleton = memo<SkeletonProps>(({ style, testID, ...rest }) => {
  const styles = useStyles()
  const animation = useSharedValue(0)
  const animatedStyles = useAnimatedStyle(() => ({
    left: `${interpolate(animation.value, [0, 1], [-100, 100])}%`,
  }))

  useEffect(() => {
    animation.value = withRepeat(
      withTiming(1, { duration: ANIMATION_DURATION, easing: Easing.ease }),
      -1
    )
  }, [animation])

  return (
    <View
      {...rest}
      style={[styles.container, style]}
      testID={testID ?? SkeletonTestId.root}
    >
      <Animated.View
        style={[styles.gradientContainer, animatedStyles]}
        testID={SkeletonTestId.animatedView}
      >
        <Svg testID={SkeletonTestId.svg}>
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

const useStyles = makeStyles(({ border, theme }) => ({
  container: {
    borderRadius: border.Radius['rounded-lg'],
    overflow: 'hidden',
    backgroundColor: theme.Misc.Skeleton.skeletonBg,
  },
  gradientContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: '-100%',
  },
  gradientColor: { backgroundColor: '#FBFBFB' },
}))

export const SkeletonTestId = {
  root: 'Skeleton',
  animatedView: 'Skeleton.animatedView',
  svg: 'Skeleton.svg',
}
