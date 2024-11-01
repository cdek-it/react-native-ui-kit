import type { Icon } from '@tabler/icons-react-native'
import React, { useCallback, useState } from 'react'
import { type ColorValue, type DimensionValue, type LayoutChangeEvent, View } from 'react-native'

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
   * Иконка из набора tabler
   * @type {Icon}
   */
  Icon: Icon
  /**
   * Стиль иконки
   */
  style: MenuItemIconStyle
  /**
   * Цвет бейджа
   *
   * @type {BadgeSeverity}
   */
  badgeSeverity?: BadgeSeverity
}

/**
 * Иконка в составе элемента меню. Состоит из центрирующего враппера, иконки и опционального бейджа (точки)
 * @param Icon - Иконка из набора Tabler
 * @param style - Стиль иконки
 * @param badgeSeverity - Цвет бейджа (undefined если бейдж не нужен)
 */
export const MenuItemIcon = ({ Icon, style, badgeSeverity }: MenuItemIconProps) => {
  const [badgePosition, setBadgePosition] = useState<{
    top: DimensionValue
    right: DimensionValue
  }>({ top: 0, right: 0 })

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setBadgePosition({ top: -width / 2, right: -height / 2 })
  }, [])

  return (
    <View style={{ justifyContent: 'center', position: 'relative' }}>
      <View>
        <Icon {...style} />
        {badgeSeverity ? (
          <Badge
            dot
            severity={badgeSeverity}
            style={{ position: 'absolute', top: badgePosition.top, right: badgePosition.right }}
            testID='menuItemIconBadge'
            onLayout={onLayout}
          />
        ) : (
          false
        )}
      </View>
    </View>
  )
}
