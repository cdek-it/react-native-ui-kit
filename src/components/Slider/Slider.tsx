import React, { memo, useMemo, useRef, useState } from 'react'
import { type LayoutChangeEvent, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
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
  onReturnMinPointerValue: (value: number) => void
  /**
   * Значение/позиция возвращаемое конечным ползунком
   */
  onReturnMaxPointerValue: (value: number) => void
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
    onReturnMinPointerValue,
    onReturnMaxPointerValue,
  }) => {
    const styles = useStyles()
    const [pointMinPosition, setPointMinPosition] = useState(0)
    const [pointMaxPosition, setPointMaxPosition] = useState(0)

    const trackWidth = useRef(0)
    const pointerWidth = styles.pointWidth.width
    const minTrackScale = 0
    const maxTrackScale = 100

    const [isHover, setHoverState] = useState(false)

    const minPointX = useSharedValue(0)
    const prevMinPointX = useSharedValue(0)

    const maxPointX = useSharedValue(0)
    const prevMaxPointX = useSharedValue(0)

    const pointerStyle = useMemo(
      () => [styles.point, isHover && styles.hovered, disabled && styles.disabledView],
      [styles.point, isHover, styles.hovered, styles.disabledView, disabled]
    )

    const lineStyle = useMemo(
      () => [styles.line, isHover && styles.hovered, disabled && styles.disabledView],
      [styles.line, isHover, styles.hovered, styles.disabledView, disabled]
    )

    function interpolateInitVal(value: number, width: number) {
      return interpolate(
        value,
        [minTrackScale, maxTrackScale],
        [0, width - pointerWidth],
        Extrapolation.CLAMP
      )
    }

    const onContainerLayout = (event: LayoutChangeEvent) => {
      event.target.measure((x, y, width, height, pageX, pageY) => {
        trackWidth.current = width
        const min = interpolateInitVal(minPointerValueInit, width)
        const max = interpolateInitVal(maxPointerValueInit, width)

        minPointX.value = min
        maxPointX.value = max
        setPointMinPosition(min)
        setPointMaxPosition(max)
      })
    }

    function clamp(val: number, min: number, max: number) {
      return Math.min(Math.max(val, min), max)
    }

    function returnMinVal(val: number) {
      const min = interpolate(
        val,
        [0, trackWidth.current - pointerWidth * 2],
        [minTrackScale, maxTrackScale],
        Extrapolation.CLAMP
      )
      onReturnMinPointerValue(min)
    }

    function returnMaxVal(val: number) {
      const min = interpolate(
        val,
        [pointerWidth, trackWidth.current - pointerWidth],
        [minTrackScale, maxTrackScale],
        Extrapolation.CLAMP
      )
      onReturnMaxPointerValue(min)
    }

    const panMinPoint = Gesture.Pan()
      .minDistance(1)
      .onStart(() => {
        prevMinPointX.value = minPointX.value
        setHoverState(true)
      })
      .onUpdate((event) => {
        const maxTranslateX = trackWidth.current - pointerWidth

        minPointX.value = clamp(
          prevMinPointX.value + event.translationX,
          0,
          range ? maxPointX.value - pointerWidth : maxTranslateX
        )

        setPointMinPosition(minPointX.value)
        returnMinVal(minPointX.value)
      })
      .onEnd(() => {
        returnMinVal(minPointX.value)
        setPointMinPosition(minPointX.value)
        setHoverState(false)
      })
      .runOnJS(true)

    const minPointStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: minPointX.value }],
    }))

    const panMaxPoint = Gesture.Pan()
      .minDistance(1)
      .onStart(() => {
        prevMaxPointX.value = maxPointX.value
        setHoverState(true)
      })
      .onUpdate((event) => {
        const maxTranslateX = trackWidth.current - pointerWidth

        maxPointX.value = clamp(
          prevMaxPointX.value + event.translationX,
          minPointX.value + pointerWidth,
          maxTranslateX
        )
        setPointMaxPosition(maxPointX.value)
        returnMaxVal(maxPointX.value)
      })
      .onEnd(() => {
        setPointMaxPosition(maxPointX.value)
        returnMaxVal(maxPointX.value)
        setHoverState(false)
      })
      .runOnJS(true)

    const maxPointStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: maxPointX.value }],
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

    pointWidth: {
      width: theme.Form.Slider.sliderHandleWidth,
    },
  }
})
