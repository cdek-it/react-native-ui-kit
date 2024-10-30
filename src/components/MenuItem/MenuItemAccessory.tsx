import { IconChevronRight, IconChevronDown } from '@tabler/icons-react-native'
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
  style: AccessoryStyle
}

const AccessoryBox = ({ icon }: { icon: React.ReactNode }) => {
  return <View style={{ justifyContent: 'center' }}>{icon}</View>
}

const AccessoryIcon = ({ type, style }: AccessoryProps) => {
  switch (type) {
    case 'right':
      return <AccessoryBox icon={<IconChevronRight {...style} />} />
    case 'down':
      return <AccessoryBox icon={<IconChevronDown {...style} />} />
    case 'none':
      return null
  }
}

export const MenuItemAccessory = AccessoryIcon
