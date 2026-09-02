import { useCallback, useMemo, useState } from 'react'
import {
  type ColorValue,
  type DimensionValue,
  type LayoutChangeEvent,
  View,
} from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'
import { Badge, type BadgeSeverity } from '../Badge/Badge'

interface MenuItemIconStyle {
  /** Ширина иконки в поинтах*/
  width?: number
  /** Высота иконки в поинтах*/
  height?: number
  /** Цвет иконки*/
  color?: ColorValue
}

interface MenuItemIconProps {
  /**
   * SVG-иконка
   * @type {SvgSource}
   */
  readonly Icon: SvgSource
  /**
   * Стиль иконки
   */
  readonly style: MenuItemIconStyle
  /**
   * Цвет бейджа
   *
   * @type {BadgeSeverity}
   */
  readonly badgeSeverity?: BadgeSeverity
}

/**
 * Иконка в составе элемента меню. Состоит из центрирующего враппера, иконки и опционального бейджа (точки)
 * @param Icon - SVG-иконка
 * @param style - Стиль иконки
 * @param badgeSeverity - Цвет бейджа (undefined если бейдж не нужен)
 */
export const MenuItemIcon = ({
  Icon,
  style,
  badgeSeverity,
}: MenuItemIconProps) => {
  const [badgePosition, setBadgePosition] = useState<{
    top: DimensionValue
    right: DimensionValue
  }>({ top: 0, right: 0 })

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setBadgePosition({ top: -width / 2, right: -height / 2 })
  }, [])

  const badgeStyle = useMemo(
    () =>
      StyleSheet.flatten([
        styles.badge,
        { top: badgePosition.top, right: badgePosition.right },
      ]),
    [badgePosition.right, badgePosition.top]
  )

  return (
    <View style={styles.container(style)}>
      <View>
        <SvgUniversal source={Icon} {...style} />
        {badgeSeverity ? (
          <Badge
            dot
            severity={badgeSeverity}
            style={badgeStyle}
            testID='MenuItemIconBadge'
            onLayout={onLayout}
          />
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create(() => ({
  container: ({ width, height }: MenuItemIconStyle) => {
    return { justifyContent: 'center', position: 'relative', width, height }
  },

  badge: { position: 'absolute' },
}))
