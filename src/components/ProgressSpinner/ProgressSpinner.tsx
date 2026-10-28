import { memo, useEffect, useMemo, useState } from 'react'
import {
  AccessibilityInfo,
  type AccessibilityProps,
  type ViewProps,
} from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  ReduceMotion,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'

import { StyleSheet } from 'react-native-unistyles'

const AnimatedSvg = Animated.createAnimatedComponent(Svg)
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

type ProgressSpinnerSize = 'small' | 'base' | 'large' | 'xlarge'

/** @deprecated Используйте small/base/large/xlarge (sm→small, md→base, lg→large, xl→xlarge). Удаляется в 2.0. */
type DeprecatedProgressSpinnerSize = 'sm' | 'md' | 'lg' | 'xl'

const legacySizes: Record<DeprecatedProgressSpinnerSize, ProgressSpinnerSize> =
  { sm: 'small', md: 'base', lg: 'large', xl: 'xlarge' }

export interface ProgressSpinnerProps
  extends AccessibilityProps, Pick<ViewProps, 'testID'> {
  /**
   * Выбор размера компонента
   * @default 'base'
   */
  size?: ProgressSpinnerSize | DeprecatedProgressSpinnerSize

  /**
   * Выбор цвета компонента
   * @default 'primary'
   */
  fill?: 'primary' | 'white'
}

/**
 * Используется для отображения состояний ожидания в интерфейсе
 * При Reduce Motion отображается статичная полуокружность вместо анимации дуги.
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=1219-3086
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=24043-15392
 */
export const ProgressSpinner = memo<ProgressSpinnerProps>(
  ({
    size = 'base',
    fill = 'primary',
    testID = TestId.ProgressSpinner,
    accessible = true,
    accessibilityRole = 'progressbar',
    accessibilityState,
    ...rest
  }) => {
    const [reduceMotion, setReduceMotion] = useState(false)
    const circleAnimation = useSharedValue(0)
    const containerAnimation = useSharedValue(0)

    const canonicalSize: ProgressSpinnerSize =
      size in legacySizes
        ? legacySizes[size as DeprecatedProgressSpinnerSize]
        : (size as ProgressSpinnerSize)

    const sizeStyle = styles[canonicalSize]
    const strokeWidth = styles.geometry.borderWidth

    const color = useMemo(() => {
      switch (fill) {
        case 'primary':
          return styles.primary.color

        case 'white':
          return styles.white.color
      }
    }, [fill])

    const center = sizeStyle.width / 2
    const radius = (sizeStyle.width - strokeWidth) / 2
    const circleLength = 2 * Math.PI * radius

    const containerAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        { rotate: `${reduceMotion ? 0 : containerAnimation.value * 360}deg` },
      ],
    }))

    const circleAnimatedProps = useAnimatedProps(() => ({
      strokeDasharray: [
        reduceMotion
          ? 0.5 * circleLength
          : interpolate(
              circleAnimation.value,
              [0, 0.5, 1],
              [1, 0.7 * circleLength, circleLength]
            ),
        circleLength,
      ],
      strokeDashoffset: reduceMotion
        ? 0
        : interpolate(
            circleAnimation.value,
            [0, 0.5, 1],
            [0, -(0.3 * circleLength), -circleLength + 2]
          ),
    }))

    useEffect(() => {
      let mounted = true
      let eventReceived = false
      const subscription = AccessibilityInfo.addEventListener(
        'reduceMotionChanged',
        (enabled) => {
          eventReceived = true

          if (mounted) {
            setReduceMotion(enabled)
          }
        }
      )
      AccessibilityInfo.isReduceMotionEnabled()
        .then((enabled) => {
          if (mounted && !eventReceived) {
            setReduceMotion(enabled)
          }
        })
        .catch(() => {
          // При неудаче запроса сохраняем текущее состояние анимации.
        })

      return () => {
        mounted = false
        subscription.remove()
      }
    }, [])

    useEffect(() => {
      circleAnimation.value = reduceMotion ? 0.5 : 0
      containerAnimation.value = 0

      if (!reduceMotion) {
        circleAnimation.value = withRepeat(
          withTiming(1, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            reduceMotion: ReduceMotion.Never,
          }),
          -1,
          false,
          undefined,
          ReduceMotion.Never
        )
        containerAnimation.value = withRepeat(
          withTiming(1, {
            duration: 2000,
            easing: Easing.linear,
            reduceMotion: ReduceMotion.Never,
          }),
          -1,
          false,
          undefined,
          ReduceMotion.Never
        )
      }

      return () => {
        cancelAnimation(circleAnimation)
        cancelAnimation(containerAnimation)
      }
    }, [reduceMotion, circleAnimation, containerAnimation])

    return (
      <AnimatedSvg
        {...rest}
        accessibilityRole={accessibilityRole}
        accessibilityState={{ ...accessibilityState, busy: true }}
        accessible={accessible}
        style={[containerAnimatedStyle, sizeStyle]}
        testID={testID}
      >
        <AnimatedCircle
          animatedProps={circleAnimatedProps}
          cx={center}
          cy={center}
          fill='none'
          r={radius}
          stroke={color}
          strokeLinecap='round'
          strokeWidth={strokeWidth}
        />
      </AnimatedSvg>
    )
  }
)

const styles = StyleSheet.create(
  ({ components: { progressspinner }, semantic }) => ({
    small: {
      height: progressspinner.extend.small,
      width: progressspinner.extend.small,
    },
    base: {
      height: progressspinner.extend.medium,
      width: progressspinner.extend.medium,
    },
    large: {
      height: progressspinner.extend.large,
      width: progressspinner.extend.large,
    },
    xlarge: {
      height: progressspinner.extend.xlarge,
      width: progressspinner.extend.xlarge,
    },
    geometry: { borderWidth: 4 },
    primary: { color: progressspinner.colorScheme.root.colorOne },
    white: { color: semantic.colorScheme.color.fg.on.fill.default },
  })
)

enum TestId {
  ProgressSpinner = 'ProgressSpinner',
}
