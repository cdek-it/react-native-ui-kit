import { IconChevronRight, IconChevronDown, IconLock } from '@tabler/icons-react-native'
import React from 'react'
import { type ColorValue, View } from 'react-native'

export type MenuItemTemplateAccessory = 'right' | 'down' | 'none'

/** Стиль иконки аксессуара меню */
export interface AccessoryStyle {
  /** Цвет иконки*/
  color?: ColorValue
  /** Ширина иконки в поинтах */
  width?: number
  /** Высота иконки в поинтах */
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

/**
 * Аксессуар элемента меню. Выводится в крайней левой или крайней правой позицияю пункта меню.
 *
 * @param type - Вариант аксессуара: стрелка вправо, вниз, или отсутствие аксессуара.
 * @param iconStyle - Стиль иконки (цвет и размеры)
 * @param disabled - Неактивное состояние. Если true, заменяет стрелки на иконку замка.
 * @returns Стрелка вправо, стрелка вниз или null. Если disabled=true стрелки заменяются иконкой замка.
 */
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
