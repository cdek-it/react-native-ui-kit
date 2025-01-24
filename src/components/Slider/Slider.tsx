import React, { memo, useCallback, useMemo, useState } from 'react'
import { type LayoutChangeEvent, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated'

import { makeStyles } from '../../utils/makeStyles'

export interface SliderProps {
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
  ({
    disabled = false,
    range = false,
    minPointerValueInit = 0,
    maxPointerValueInit = 100,
    onMinPointerValueChange,
    onMaxPointerValueChange,
  }) => {
    const styles = useStyles()
    const [pointMinPosition, setPointMinPosition] = useState(0)
    const [pointMaxPosition, setPointMaxPosition] = useState(0)

    const trackWidth = useSharedValue(0)
    const pointerWidth = styles.point.width

    const [isPressed, setIsPressed] = useState(false)

    const prevMinPointX = useSharedValue(0)
    const prevMaxPointX = useSharedValue(0)

    const pointerStyle = useMemo(
      () => [styles.point, isPressed && styles.hovered, disabled && styles.disabledView],
      [styles.point, isPressed, styles.hovered, styles.disabledView, disabled]
    )

    const lineStyle = useMemo(
      () => [styles.line, isPressed && styles.hovered, disabled && styles.disabledView],
      [styles.line, isPressed, styles.hovered, styles.disabledView, disabled]
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

    const onContainerLayout = (event: LayoutChangeEvent) => {
      event.target.measure((x, y, width, height, pageX, pageY) => {
        trackWidth.value = width
        const min = interpolateInitVal(minPointerValueInit, width)
        const max = interpolateInitVal(maxPointerValueInit, width)

        setPointMinPosition(min)
        setPointMaxPosition(max)
      })
    }

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
      [trackWidth, pointerWidth]
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
      [trackWidth, pointerWidth]
    )

    const panMinPoint = Gesture.Pan()
      .minDistance(1)
      .onBegin(() => {
        prevMinPointX.value = pointMinPosition
        runOnJS(setIsPressed)(true)
      })
      .onUpdate((event) => {
        const maxTranslateX = trackWidth.value - pointerWidth

        const minPointX = clamp(
          prevMinPointX.value + event.translationX,
          0,
          range ? pointMaxPosition - pointerWidth : maxTranslateX
        )

        setPointMinPosition(minPointX)
        returnMinVal(minPointX)
      })
      .onFinalize(() => {
        runOnJS(setIsPressed)(false)
      })

    const minPointStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: pointMinPosition }],
    }))

    const panMaxPoint = Gesture.Pan()
      .minDistance(1)
      .onBegin(() => {
        prevMaxPointX.value = pointMaxPosition
        runOnJS(setIsPressed)(true)
      })
      .onUpdate((event) => {
        const maxTranslateX = trackWidth.value - pointerWidth

        const maxPointX = clamp(
          prevMaxPointX.value + event.translationX,
          pointMinPosition + pointerWidth,
          maxTranslateX
        )
        setPointMaxPosition(maxPointX)
        returnMaxVal(maxPointX)
      })
      .onFinalize(() => {
        runOnJS(setIsPressed)(false)
      })

    const maxPointStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: pointMaxPosition }],
    }))

    return (
      <View style={styles.container} onLayout={onContainerLayout}>
        <View style={styles.track}>
          {range ? null : ( // индикатор старта
            <View style={[lineStyle, { left: 0, width: pointMinPosition + pointerWidth / 2 }]} />
          )}

          {range ? ( // индикатор между точками
            <View
              style={[
                lineStyle,
                {
                  left: pointMinPosition + pointerWidth / 2,
                  width: pointMaxPosition - pointMinPosition,
                },
              ]}
            />
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

const useStyles = makeStyles(({ theme }) => {
  return {
    container: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    track: {
      height: theme.Form.Slider.sliderHorizontalHeight,
      backgroundColor: theme.Form.Slider.sliderBg,
      borderRadius: theme.Form.Slider.sliderHandleBorderRadius,
      position: 'relative',
      width: '100%',
      justifyContent: 'center',
    },

    line: {
      height: theme.Form.Slider.sliderHorizontalHeight,
      borderRadius: theme.Form.Slider.sliderHandleBorderRadius,
      position: 'absolute',
      backgroundColor: theme.Form.Slider.sliderRangeBg,
    },

    point: {
      width: theme.Form.Slider.sliderHandleWidth,
      height: theme.Form.Slider.sliderHandleHeight,
      borderRadius: theme.Form.Slider.sliderHandleHeight / 2,
      position: 'absolute',
      backgroundColor: theme.Form.Slider.sliderHandleBg,
    },

    disabledView: {
      backgroundColor: 'grey',
    },

    hovered: {
      backgroundColor: theme.Form.Slider.sliderHandleHoverBg,
    },
  }
})
