import React, { memo, useEffect } from 'react'
import { View, type ViewStyle } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

import { makeStyles } from '../../utils/makeStyles'

interface SkeletonProps {
  /** Дополнительная стилизация для контейнера компонента */
  style?: ViewStyle
}

const ANIMATION_DURATION = 1200 // ms

/**
 * Используется для отображения контента в момент загрузки
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=5241-3731
 */
export const Skeleton = memo<SkeletonProps>(({ style }) => {
  const styles = useStyles()
  const animation = useSharedValue(0)
  const animatedStyles = useAnimatedStyle(() => ({
    left: `${interpolate(animation.value, [0, 1], [-100, 100])}%`,
  }))

  useEffect(() => {
    animation.value = withRepeat(
      withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.ease,
      }),
      -1
    )
  }, [animation])

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.gradientContainer, animatedStyles]}>
        <Svg>
          <Defs>
            <LinearGradient id='gradient' x1='0' x2='1' y1='1' y2='1'>
              <Stop offset='0' stopColor={styles.container.backgroundColor} stopOpacity='0.4' />
              <Stop
                offset='0.5'
                stopColor={styles.gradientColor.backgroundColor}
                stopOpacity='0.4'
              />
              <Stop offset='1' stopColor={styles.container.backgroundColor} stopOpacity='0.4' />
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
  gradientColor: {
    backgroundColor: '#FBFBFB',
  },
}))
