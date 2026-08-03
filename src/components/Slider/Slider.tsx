import { memo, useCallback, useMemo, useState } from 'react'
import {
  type AccessibilityProps,
  type LayoutChangeEvent,
  View,
  type ViewProps,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'

import { StyleSheet } from 'react-native-unistyles'
import { scheduleOnRN } from 'react-native-worklets'

export interface SliderProps
  extends AccessibilityProps, Pick<ViewProps, 'testID'> {
  /**
   * Управление доступностью компонента
   * @default false
   */
  disabled?: boolean
  /**
   * Признак наличия диапазона выбираемых значений
   * @default false
   */
  range?: boolean
  /**
   * Начальное значение/позиция стартового ползунка
   * @default 0
   */
  minPointerValueInit: number
  /**
   * Конечное значение/позиция конечного ползунка
   * @default 100
   */
  maxPointerValueInit?: number
  /**
   * Значение/позиция возвращаемое стартовым ползунком
   */
  onMinPointerValueChange: (value: number) => void
  /**
   * Значение/позиция возвращаемое конечным ползунком
   */
  onMaxPointerValueChange: (value: number) => void
}

const MIN_TRACK_SCALE = 0
const MAX_TRACK_SCALE = 100

const clamp = (val: number, min: number, max: number) => {
  'worklet'

  return Math.min(Math.max(val, min), max)
}

/**
 * Используется для указания значения или диапазона значений с помощью ползунка
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-6090&m=dev
 */
export const Slider = memo<SliderProps>(
  // TODO: refactor component to fix max-statements

  ({
    disabled = false,
    range = false,
    minPointerValueInit = 0,
    maxPointerValueInit = 100,
    onMinPointerValueChange,
    onMaxPointerValueChange,
    testID,
    ...rest
  }) => {
    const minPointX = useSharedValue(0)
    const maxPointX = useSharedValue(0)

    const trackWidth = useSharedValue(0)
    const pointerWidth = styles.point.width

    const [isPressed, setIsPressed] = useState(false)

    const prevMinPointX = useSharedValue(0)
    const prevMaxPointX = useSharedValue(0)

    const pointerStyle = useMemo(
      () => [styles.point, isPressed && styles.hovered],
      [isPressed]
    )

    const lineStyle = useMemo(
      () => [styles.line, isPressed && styles.hovered],
      [isPressed]
    )

    const interpolateInitVal = useCallback(
      (value: number, width: number) => {
        return interpolate(
          value,
          [MIN_TRACK_SCALE, MAX_TRACK_SCALE],
          [0, width - pointerWidth],
          Extrapolation.CLAMP
        )
      },
      [pointerWidth]
    )

    const onContainerLayout = useCallback(
      (event: LayoutChangeEvent) => {
        event.target.measure((x, y, width) => {
          trackWidth.value = width
          const min = interpolateInitVal(minPointerValueInit, width)
          const max = interpolateInitVal(maxPointerValueInit, width)

          minPointX.value = min
          maxPointX.value = max
        })
      },
      [
        minPointerValueInit,
        maxPointerValueInit,
        interpolateInitVal,
        trackWidth,
        minPointX,
        maxPointX,
      ]
    )

    const returnMinVal = useCallback(
      (value: number) => {
        const min = interpolate(
          value,
          [0, trackWidth.value - pointerWidth * 2],
          [MIN_TRACK_SCALE, MAX_TRACK_SCALE],
          Extrapolation.CLAMP
        )
        onMinPointerValueChange(min)
      },
      [trackWidth, pointerWidth, onMinPointerValueChange]
    )

    const returnMaxVal = useCallback(
      (value: number) => {
        const min = interpolate(
          value,
          [pointerWidth, trackWidth.value - pointerWidth],
          [MIN_TRACK_SCALE, MAX_TRACK_SCALE],
          Extrapolation.CLAMP
        )
        onMaxPointerValueChange(min)
      },
      [trackWidth, pointerWidth, onMaxPointerValueChange]
    )

    const panMinPoint = Gesture.Pan()
      .minDistance(1)
      .onBegin(() => {
        prevMinPointX.value = minPointX.value
        scheduleOnRN(setIsPressed, true)
      })
      .onUpdate((event) => {
        const maxTranslateX = trackWidth.value - pointerWidth

        const minPointPosition = clamp(
          prevMinPointX.value + event.translationX,
          0,
          range ? maxPointX.value - pointerWidth : maxTranslateX
        )

        minPointX.value = minPointPosition
        scheduleOnRN(returnMinVal, minPointPosition)
      })
      .onFinalize(() => {
        scheduleOnRN(setIsPressed, false)
      })

    const minPointStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: minPointX.value }],
    }))

    const panMaxPoint = Gesture.Pan()
      .minDistance(1)
      .onBegin(() => {
        prevMaxPointX.value = maxPointX.value
        scheduleOnRN(setIsPressed, true)
      })
      .onUpdate((event) => {
        const maxTranslateX = trackWidth.value - pointerWidth

        const maxPointPosition = clamp(
          prevMaxPointX.value + event.translationX,
          minPointX.value + pointerWidth,
          maxTranslateX
        )
        maxPointX.value = maxPointPosition
        scheduleOnRN(returnMaxVal, maxPointPosition)
      })
      .onFinalize(() => {
        scheduleOnRN(setIsPressed, false)
      })

    const maxPointStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: maxPointX.value }],
    }))

    const minLineStyle = useAnimatedStyle(() => ({
      left: 0,
      width: minPointX.value + pointerWidth / 2,
    }))

    const betweenLineStyle = useAnimatedStyle(() => ({
      left: minPointX.value + pointerWidth / 2,
      width: maxPointX.value - minPointX.value,
    }))

    return (
      <View
        style={[styles.container, disabled && styles.disabled]}
        testID={testID}
        onLayout={onContainerLayout}
        {...rest}
      >
        <View style={styles.track}>
          {range ? null : ( // индикатор старта
            <Animated.View style={[lineStyle, minLineStyle]} />
          )}

          {range ? ( // индикатор между точками
            <Animated.View style={[lineStyle, betweenLineStyle]} />
          ) : null}

          <GestureDetector gesture={panMinPoint}>
            <Animated.View
              pointerEvents={disabled ? 'none' : 'auto'}
              style={[pointerStyle, minPointStyle]}
            />
          </GestureDetector>

          {range ? ( // индикатор между точками
            <GestureDetector gesture={panMaxPoint}>
              <Animated.View
                pointerEvents={disabled ? 'none' : 'auto'}
                style={[pointerStyle, maxPointStyle]}
              />
            </GestureDetector>
          ) : null}
        </View>
      </View>
    )
  }
)

const styles = StyleSheet.create(({ semantic, components }) => {
  return {
    container: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    track: {
      height: components.slider.track.size,
      backgroundColor: components.slider.track.background,
      borderRadius: components.slider.track.borderRadius,
      position: 'relative',
      width: '100%',
      justifyContent: 'center',
    },

    line: {
      height: components.slider.track.size,
      borderRadius: components.slider.track.borderRadius,
      position: 'absolute',
      backgroundColor: components.slider.range.background,
    },

    point: {
      width: components.slider.handle.width,
      height: components.slider.handle.height,
      borderRadius: components.slider.handle.borderRadius,
      position: 'absolute',
      backgroundColor: components.slider.colorScheme.handle.content.background,
      borderWidth: semantic.dimension.borderWidth[300],
      borderColor: components.slider.handle.background,
    },

    disabled: { opacity: 0.6, mixBlendMode: 'luminosity' },

    hovered: { backgroundColor: components.slider.handle.hoverBackground },
  }
})
