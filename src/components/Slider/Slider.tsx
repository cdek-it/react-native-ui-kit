import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import {
  type GestureResponderEvent,
  PanResponder,
  type PanResponderGestureState,
  View,
} from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

export interface SliderProps {
  disabled?: boolean
  range?: boolean
  minPointerValueInit: number
  maxPointerValueInit?: number
  onReturnMinPointerValue: (value: number) => void
  onReturnMaxPointerValue: (value: number) => void
}

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
    const [pointMinOffset, setPointMinOffset] = useState<number>(0)
    const [pointMaxOffset, setPointMaxOffset] = useState<number>(0)
    const [pointMinPosition, setPointMinPosition] = useState<number>(0)
    const [pointMaxPosition, setPointMaxPosition] = useState<number>(0)

    const absolutePosX = useRef<number>(0)
    const trackWidth = useRef<number>(0)
    const layoutStartPos = useRef<number>(0)
    const layoutStep = useRef<number>(0)
    const trackRef = useRef<View | null>(null)
    const pointerWidth = styles.pointWidth.width
    const trackScale = 100

    const [isHover, setHoverState] = useState(false)

    useEffect(() => {
      if (trackRef.current) {
        trackRef.current.measure((x, y, width) => {
          trackWidth.current = width
          layoutStartPos.current = x
        })
      }
    }, [])

    const minPointerResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event: GestureResponderEvent) => {
        const pointerX = event.nativeEvent.pageX
        const offset = pointerX - pointMinPosition
        setPointMinOffset(event.nativeEvent.locationX)
        setPointMinPosition(Math.max(0, pointerX - offset))
        setHoverState(true)
      },
      onPanResponderMove: (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const newPointer1Position =
          gestureState.moveX - (layoutStartPos.current + absolutePosX.current) - pointMinOffset
        const newPosition = Math.max(
          0,
          Math.min(newPointer1Position, pointMaxPosition - pointerWidth)
        )
        if (pointMinPosition !== Math.max(0, newPosition)) {
          setPointMinPosition(newPosition)
          onReturnMinPointerValue(newPosition / layoutStep.current)
        }
      },
      onPanResponderRelease: () => {
        setHoverState(false)
      },
    })

    const maxPointerResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event: GestureResponderEvent) => {
        const pointerX = event.nativeEvent.pageX
        const offset = pointerX - pointMaxPosition
        setPointMaxOffset(event.nativeEvent.locationX)
        setPointMaxPosition(
          Math.max(pointMinPosition, Math.min(pointerX - offset, trackWidth.current))
        )
        setHoverState(true)
      },
      onPanResponderMove: (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const newPointer2Position =
          gestureState.moveX - (layoutStartPos.current + absolutePosX.current) - pointMaxOffset
        const newPosition = Math.max(
          pointMinPosition + pointerWidth,
          Math.min(newPointer2Position, trackWidth.current - pointerWidth)
        )
        setPointMaxPosition(newPosition)
        onReturnMaxPointerValue((newPosition - pointerWidth) / layoutStep.current)
      },
      onPanResponderRelease: () => {
        setHoverState(false)
      },
    })

    const pointStyles = useMemo(
      () => [styles.point, isHover && styles.hovered, disabled && styles.disabledView],
      [styles.point, isHover, styles.hovered, styles.disabledView, disabled]
    )

    const lineStyles = useMemo(
      () => [styles.line, isHover && styles.hovered, disabled && styles.disabledView],
      [styles.line, isHover, styles.hovered, styles.disabledView, disabled]
    )

    return (
      <View
        style={styles.container}
        onLayout={(event) =>
          event.target.measure((x, y, width, height, pageX, pageY) => {
            absolutePosX.current = pageX
            const step = range
              ? (width - pointerWidth * 2) / trackScale
              : (width - pointerWidth) / trackScale
            layoutStep.current = step

            setPointMinPosition(step * minPointerValueInit)
            // если не стоит признак , то для надежности игнорируем стартовое значение
            // второй точки даже если его задали
            if (range) {
              setPointMaxPosition(step * maxPointerValueInit + pointerWidth)
            } else {
              setPointMaxPosition(width)
            }
          })
        }
      >
        <View ref={trackRef} style={styles.track}>
          {range ? null : ( // индикатор старта
            <View style={[lineStyles, { left: 0, width: pointMinPosition + pointerWidth / 2 }]} />
          )}

          {range ? ( // индикатор между точками
            <View
              style={[
                lineStyles,
                {
                  left: pointMinPosition + pointerWidth / 2,
                  width: pointMaxPosition - pointMinPosition,
                },
              ]}
            />
          ) : null}

          <View
            pointerEvents={disabled ? 'none' : 'auto'}
            {...minPointerResponder.panHandlers}
            style={[pointStyles, { left: pointMinPosition }]}
          />

          {range ? (
            <View
              pointerEvents={disabled ? 'none' : 'auto'}
              {...maxPointerResponder.panHandlers}
              style={[pointStyles, { left: pointMaxPosition }]}
            />
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
