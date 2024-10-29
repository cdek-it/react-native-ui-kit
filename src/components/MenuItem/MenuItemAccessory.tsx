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

const AccessoryIcon = ({ type, style }: AccessoryProps) => {
  switch (type) {
    case 'right':
      return <IconChevronRight color={style.color} />
    case 'down':
      return <IconChevronDown color={style.color} />
    case 'none':
      return null
  }
}

export const MenuItemAccessory = ({ type, style }: AccessoryProps) => {
  return (
    <View style={{ justifyContent: 'center' }}>
      <AccessoryIcon style={style} type={type} />
    </View>
  )
}
