import { IconChevronRight, IconChevronDown, IconLock } from '@tabler/icons-react-native'
import React from 'react'
import { type ColorValue, View } from 'react-native'

export type MenuItemTemplateAccessory = 'right' | 'down' | 'none'

export interface AccessoryStyle {
  color?: ColorValue
  width?: number
  height?: number
}

interface AccessoryProps {
  type: MenuItemTemplateAccessory
  iconStyle: AccessoryStyle
  disabled: boolean
}

const AccessoryBox = ({ icon }: { icon: React.ReactNode }) => {
  return <View style={{ justifyContent: 'center' }}>{icon}</View>
}

const AccessoryIcon = ({ type, iconStyle, disabled }: AccessoryProps) => {
  if (type !== 'none' && disabled) {
    return <AccessoryBox icon={<IconLock {...iconStyle} />} />
  }
  switch (type) {
    case 'right':
      return <AccessoryBox icon={<IconChevronRight {...iconStyle} />} />
    case 'down':
      return <AccessoryBox icon={<IconChevronDown {...iconStyle} />} />
    case 'none':
      return null
  }
}

export const MenuItemAccessory = AccessoryIcon
