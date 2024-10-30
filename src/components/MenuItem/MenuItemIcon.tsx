import type { Icon } from '@tabler/icons-react-native'
import React from 'react'
import { type ColorValue, View } from 'react-native'

interface MenuItemIconStyle {
  width?: number
  height?: number
  color?: ColorValue
}

interface MenuItemIconProps {
  Icon?: Icon
  style: MenuItemIconStyle
}

export const MenuItemIcon = ({ Icon, style }: MenuItemIconProps) => {
  if (Icon === undefined) {
    return null
  }
  return (
    <View style={{ justifyContent: 'center' }}>
      <Icon color={style.color} height={style.height} width={style.width} />
    </View>
  )
}
