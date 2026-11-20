import { useEffect, useLayoutEffect, useState } from 'react'
import { BackHandler, Pressable, View } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import type { TooltipProps } from '../types'

import { ARROW_DEPTH, ARROW_WIDTH } from './TooltipArrow'
import { TooltipBubble } from './TooltipBubble'
import {
  getTooltipCoordinates,
  getTooltipPlacement,
  type Rect,
  type Size,
} from './placement'

interface TooltipOverlayProps extends Pick<
  TooltipProps,
  'text' | 'position' | 'testID' | 'onClose'
> {
  readonly viewport: Rect
  readonly bounds: Rect
  readonly anchor: Rect
  readonly fontScale: number
  readonly isMeasuring: boolean
}

const PositionedTooltip = ({
  anchor,
  viewport,
  bounds,
  text,
  position = 'top',
  fontScale,
  isMeasuring,
  testID,
}: Omit<TooltipOverlayProps, 'onClose'>) => {
  const { theme } = useUnistyles()
  const tokens = theme.components.tooltip.root
  const maxWidth = Math.min(tokens.maxWidth, bounds.width)
  const [naturalSize, setNaturalSize] = useState<Size>()
  const [cardSize, setCardSize] = useState<Size>()

  useLayoutEffect(() => {
    setNaturalSize(undefined)
    setCardSize(undefined)
  }, [text, position, fontScale, maxWidth, bounds.width, bounds.height])

  const localAnchor = {
    ...anchor,
    x: anchor.x - viewport.x,
    y: anchor.y - viewport.y,
  }
  const options = {
    anchor: localAnchor,
    bounds,
    position,
    gutter: tokens.gutter,
    arrowDepth: ARROW_DEPTH,
  }
  const placement =
    naturalSize && getTooltipPlacement({ ...options, size: naturalSize })
  const coordinates =
    placement &&
    cardSize &&
    getTooltipCoordinates({
      ...options,
      position: placement.position,
      size: cardSize,
      arrowWidth: ARROW_WIDTH,
      borderRadius: tokens.borderRadius,
    })

  return (
    <>
      {naturalSize ? null : (
        <View pointerEvents='none' style={styles.probe}>
          <TooltipBubble
            isProbe
            maxWidth={maxWidth}
            position={position}
            testID='TooltipProbe'
            text={text}
            onLayout={({ nativeEvent: { layout } }) =>
              setNaturalSize({ width: layout.width, height: layout.height })
            }
          />
        </View>
      )}
      {placement ? (
        <View
          style={[
            styles.positioned,
            (!coordinates || isMeasuring) && styles.hidden,
            { left: coordinates?.x ?? 0, top: coordinates?.y ?? 0 },
          ]}
          testID={testID}
        >
          <TooltipBubble
            arrowOffset={coordinates?.arrowOffset}
            maxHeight={placement.maxHeight}
            maxWidth={Math.min(tokens.maxWidth, placement.maxWidth)}
            position={placement.position}
            testID='TooltipBubble'
            text={text}
            onLayout={({ nativeEvent: { layout } }) => {
              setCardSize((previous) =>
                previous?.width === layout.width &&
                previous?.height === layout.height
                  ? previous
                  : { width: layout.width, height: layout.height }
              )
            }}
          />
        </View>
      ) : null}
    </>
  )
}

export const TooltipOverlay = ({ onClose, ...props }: TooltipOverlayProps) => {
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onClose()

        return true
      }
    )

    return () => subscription.remove()
  }, [onClose])

  return (
    <View
      style={styles.backdrop}
      testID='TooltipViewport'
      // Касания подсказки не должны запускать сброс фокуса у предков экрана.
      onStartShouldSetResponder={() => true}
    >
      <Pressable
        accessible={false}
        style={styles.backdrop}
        testID='TooltipBackdrop'
        onPressIn={() => onClose()}
      />
      <PositionedTooltip {...props} />
    </View>
  )
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  positioned: { position: 'absolute' },
  hidden: { opacity: 0 },
  probe: { position: 'absolute', opacity: 0 },
})
