import { useLayoutEffect, useRef, useState } from 'react'
import { Modal, Pressable, View } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import type { TooltipProps } from '../types'

import { ARROW_DEPTH, ARROW_WIDTH, TooltipBubble } from './TooltipBubble'
import { measureInViewport } from './measureInViewport'
import {
  getTooltipBounds,
  getTooltipCoordinates,
  getTooltipPlacement,
  type Rect,
  type Size,
} from './placement'

interface TooltipOverlayProps extends Pick<
  TooltipProps,
  'text' | 'position' | 'testID' | 'onClose'
> {
  readonly anchor: Rect
  readonly fontScale: number
  readonly isMeasuring: boolean
}

const PositionedTooltip = ({
  anchor,
  viewport,
  text,
  position = 'top',
  fontScale,
  isMeasuring,
  testID,
}: Omit<TooltipOverlayProps, 'onClose'> & { readonly viewport: Rect }) => {
  const { theme, rt } = useUnistyles()
  const tokens = theme.components.tooltip.root
  const bounds = getTooltipBounds(viewport, rt.insets, tokens.gutter)
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

export const TooltipOverlay = ({
  anchor,
  fontScale,
  isMeasuring,
  text,
  position = 'top',
  onClose,
  testID,
}: TooltipOverlayProps) => {
  const rootRef = useRef<View>(null)
  const [viewport, setViewport] = useState<Rect>()

  return (
    <Modal
      navigationBarTranslucent
      statusBarTranslucent
      transparent
      visible
      animationType='none'
      supportedOrientations={[
        'portrait',
        'portrait-upside-down',
        'landscape',
        'landscape-left',
        'landscape-right',
      ]}
      testID='TooltipModal'
      onRequestClose={() => onClose()}
    >
      <View
        collapsable={false}
        ref={rootRef}
        style={styles.viewport}
        testID='TooltipViewport'
        onLayout={() => {
          const root = rootRef.current

          if (root)
            measureInViewport(root, (rect) => {
              setViewport((previous) =>
                previous?.x === rect.x &&
                previous?.y === rect.y &&
                previous?.width === rect.width &&
                previous?.height === rect.height
                  ? previous
                  : rect
              )
            })
        }}
      >
        <Pressable
          accessible={false}
          style={styles.backdrop}
          testID='TooltipBackdrop'
          onPressIn={() => onClose()}
        />
        {viewport ? (
          <PositionedTooltip
            anchor={anchor}
            fontScale={fontScale}
            isMeasuring={isMeasuring}
            position={position}
            testID={testID}
            text={text}
            viewport={viewport}
          />
        ) : null}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  viewport: { flex: 1 },
  backdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  positioned: { position: 'absolute' },
  hidden: { opacity: 0 },
  probe: { position: 'absolute', opacity: 0 },
})
