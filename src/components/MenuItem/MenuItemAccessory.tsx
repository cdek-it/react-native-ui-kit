import { IconChevronRight, IconChevronDown } from '@tabler/icons-react-native'
import React from 'react'
import { type ColorValue, View } from 'react-native'

export type MenuItemTemplateAccessory = 'right' | 'down' | 'none'

export interface AccessoryStyle {
  color?: ColorValue
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
      return <AccessoryBox icon={<IconChevronRight color={style.color} />} />
    case 'down':
      return <AccessoryBox icon={<IconChevronDown color={style.color} />} />
    case 'none':
      return null
  }
}

export const MenuItemAccessory = AccessoryIcon
