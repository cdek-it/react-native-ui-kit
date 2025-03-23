import {
  IconChevronRight,
  IconChevronDown,
  IconLock,
} from '@tabler/icons-react-native'
import type { ReactNode } from 'react'

import { type ColorValue, View } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

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
  readonly type: MenuItemTemplateAccessory
  readonly iconStyle: AccessoryStyle
  readonly disabled: boolean
}

const AccessoryBox = ({ icon }: { readonly icon: ReactNode }) => {
  const styles = useStyles()

  return <View style={styles.accessoryBox}>{icon}</View>
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

const useStyles = makeStyles(() => ({
  accessoryBox: { justifyContent: 'center' },
}))
