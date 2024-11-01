import { IconChevronRight, IconChevronDown, IconLock } from '@tabler/icons-react-native'
import React from 'react'
import { type ColorValue, View, type ViewStyle } from 'react-native'

export type MenuItemTemplateAccessory = 'right' | 'down' | 'none'

export interface AccessoryStyle {
  color?: ColorValue
  width?: number
  height?: number
}

interface AccessoryProps {
  type: MenuItemTemplateAccessory
  iconStyle?: AccessoryStyle
  style?: ViewStyle
  disabled?: boolean
}

const AccessoryBox = ({ icon, style }: { icon: React.ReactNode; style?: ViewStyle }) => {
  return <View style={[{ justifyContent: 'center' }, style]}>{icon}</View>
}

const AccessoryIcon = ({ type, style, iconStyle, disabled = false }: AccessoryProps) => {
  if (type !== 'none' && disabled) {
    return <AccessoryBox icon={<IconLock {...iconStyle} />} style={style} />
  }
  switch (type) {
    case 'right':
      return <AccessoryBox icon={<IconChevronRight {...iconStyle} />} style={style} />
    case 'down':
      return <AccessoryBox icon={<IconChevronDown {...iconStyle} />} style={style} />
    case 'none':
      return null
  }
}

export const MenuItemAccessory = AccessoryIcon
