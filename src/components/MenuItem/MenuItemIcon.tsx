import type { Icon } from '@tabler/icons-react-native'
import React, { useCallback, useState } from 'react'
import { type ColorValue, type DimensionValue, type LayoutChangeEvent, View } from 'react-native'

import { Badge, type BadgeSeverity } from '../Badge/Badge'

interface MenuItemIconStyle {
  width?: number
  height?: number
  color?: ColorValue
}

interface MenuItemIconProps {
  Icon: Icon
  style: MenuItemIconStyle
  badgeSeverity?: BadgeSeverity
}

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
        <Icon color={style.color} height={style.height} width={style.width} />
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
