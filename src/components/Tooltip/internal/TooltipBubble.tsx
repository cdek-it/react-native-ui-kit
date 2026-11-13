import { ScrollView, Text, View, type LayoutChangeEvent } from 'react-native'
import { SvgXml } from 'react-native-svg'
import { StyleSheet } from 'react-native-unistyles'

import type { TooltipPosition } from '../types'

import arrowAsset from './assets/arrow.json'

// Размеры исходного SVG из Figma, без масштабирования при повороте.
export const ARROW_WIDTH = arrowAsset.width
export const ARROW_DEPTH = arrowAsset.height

interface TooltipBubbleProps {
  readonly text: string
  readonly position: TooltipPosition
  readonly maxWidth: number
  readonly maxHeight?: number
  readonly arrowOffset?: number
  readonly onLayout?: (event: LayoutChangeEvent) => void
  readonly testID?: string
  readonly isProbe?: boolean
}

export const TooltipBubble = ({
  text,
  position,
  maxWidth,
  maxHeight,
  arrowOffset,
  onLayout,
  testID,
  isProbe = false,
}: TooltipBubbleProps) => {
  const vertical = position === 'top' || position === 'bottom'
  const before = position === 'bottom' || position === 'right'
  const rotation = {
    top: '0deg',
    bottom: '180deg',
    left: '-90deg',
    right: '90deg',
  }[position]
  const arrow = !isProbe && (
    <View
      pointerEvents='none'
      style={[
        styles.arrowSlot,
        {
          width: vertical ? ARROW_WIDTH : ARROW_DEPTH,
          height: vertical ? ARROW_DEPTH : ARROW_WIDTH,
        },
        arrowOffset === undefined
          ? styles.centerArrow
          : vertical
            ? { marginLeft: arrowOffset }
            : { marginTop: arrowOffset },
      ]}
    >
      <SvgXml
        height={ARROW_DEPTH}
        style={{ transform: [{ rotate: rotation }] }}
        width={ARROW_WIDTH}
        xml={arrowAsset.xml}
      />
    </View>
  )

  return (
    <View style={[styles.root, vertical ? styles.vertical : styles.horizontal]}>
      {before ? arrow : null}
      <View
        style={[styles.card, { maxWidth, maxHeight }]}
        testID={testID}
        onLayout={onLayout}
      >
        {isProbe ? (
          <Text accessible={false} style={styles.text}>
            {text}
          </Text>
        ) : (
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
          >
            <Text accessible={false} style={styles.text}>
              {text}
            </Text>
          </ScrollView>
        )}
      </View>
      {!before && arrow}
    </View>
  )
}

const styles = StyleSheet.create(({ components, fonts }) => ({
  root: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  vertical: { flexDirection: 'column' },
  horizontal: { flexDirection: 'row' },
  card: {
    backgroundColor: components.tooltip.colorScheme.root.background,
    borderRadius: components.tooltip.root.borderRadius,
    boxShadow: `${components.tooltip.root.subtleShadow}, ${components.tooltip.root.shadow}`,
    overflow: 'hidden',
    paddingTop: components.tooltip.root.paddingTop,
    paddingRight: components.tooltip.root.paddingRight,
    paddingBottom: components.tooltip.root.paddingBottom,
    paddingLeft: components.tooltip.root.paddingLeft,
    flexShrink: 1,
  },
  scroll: { flexGrow: 0, flexShrink: 1 },
  scrollContent: { flexGrow: 0 },
  text: {
    color: components.tooltip.colorScheme.root.color,
    fontFamily: fonts.fontFamily.base,
    fontSize: fonts.fontSize[200],
    fontWeight: fonts.fontWeight.regular,
    lineHeight: fonts.lineHeight[300],
    textAlign: 'center',
    flexShrink: 1,
  },
  arrowSlot: { alignItems: 'center', justifyContent: 'center' },
  centerArrow: { alignSelf: 'center' },
}))
