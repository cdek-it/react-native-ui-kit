import React, { memo, useEffect, useMemo } from 'react'
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'

import { makeStyles } from '../../utils/makeStyles'

const AnimatedSvg = Animated.createAnimatedComponent(Svg)
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const STROKE_WIDTH = 2

export interface ProgressSpinnerProps {
  /**
   * Выбор размера компонента
   * @default 'md'
   */
  size?: 'xl' | 'lg' | 'md' | 'sm'

  /**
   * Выбор цвета компонента
   * @default 'primary'
   */
  fill?: 'primary' | 'white'
}

/**
 * Используется для отображения состояний ожидания в интерфейсе
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=1219-3086
 */
export const ProgressSpinner = memo<ProgressSpinnerProps>(({ size = 'md', fill = 'primary' }) => {
  const styles = useStyles()
  const circleAnimation = useSharedValue(0)
  const containerAnimation = useSharedValue(0)

  const sizeInDp = useMemo(() => {
    switch (size) {
      case 'xl':
        return 56
      case 'lg':
        return 42
      case 'md':
        return 28
      case 'sm':
        return 14
    }
  }, [size])

  const color = useMemo(() => {
    switch (fill) {
      case 'primary':
        return styles.primary.color
      case 'white':
        return styles.white.color
    }
  }, [fill, styles.primary.color, styles.white.color])

  const center = useMemo(() => sizeInDp / 2, [sizeInDp])
  const radius = useMemo(() => center - STROKE_WIDTH / 2, [center])
  const circleLength = useMemo(() => 2 * Math.PI * radius, [radius])

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${containerAnimation.value * 360}deg`,
      },
    ],
  }))

  const circleAnimatedProps = useAnimatedProps(() => ({
    strokeDasharray: [
      interpolate(circleAnimation.value, [0, 0.5, 1], [1, 0.7 * circleLength, circleLength]),
      circleLength,
    ],
    strokeDashoffset: interpolate(
      circleAnimation.value,
      [0, 0.5, 1],
      [0, -(0.3 * circleLength), -circleLength + 2]
    ),
  }))

  useEffect(() => {
    circleAnimation.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    )
  }, [circleAnimation])

  useEffect(() => {
    containerAnimation.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1
    )
  }, [containerAnimation])

  return (
    <AnimatedSvg
      style={[containerAnimatedStyle, { width: sizeInDp, height: sizeInDp }]}
      testID={TestId.ProgressSpinner}
    >
      <AnimatedCircle
        animatedProps={circleAnimatedProps}
        cx={center}
        cy={center}
        fill='none'
        r={radius}
        stroke={color}
        strokeLinecap='round'
        strokeWidth={STROKE_WIDTH}
      />
    </AnimatedSvg>
  )
})

const useStyles = makeStyles(({ theme, global }) => ({
  primary: {
    color: theme.General.primaryColor,
  },
  white: {
    color: global.Neutrals.White['white-100'],
  },
}))

enum TestId {
  ProgressSpinner = 'ProgressSpinner',
}
