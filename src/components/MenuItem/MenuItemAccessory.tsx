import { IconLock } from '@tabler/icons-react-native'
import { memo, useMemo } from 'react'

import { View } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'

export interface MenuItemAccessoryProps {
  /** SVG-иконка */
  readonly Icon: SvgSource
  /** Неактивное состояние. Если true, заменяет Icon на иконку замка. */
  readonly disabled?: boolean
}

/**
 * Аксессуар элемента меню. Выводится в крайней левой или крайней правой позиции пункта меню.
 */
export const MenuItemAccessory = memo<MenuItemAccessoryProps>(
  ({ Icon, disabled }) => {
    const IconComponent = useMemo(
      () => (disabled ? IconLock : Icon),
      [Icon, disabled]
    )

    return (
      <View style={styles.container}>
        <SvgUniversal
          {...styles.icon}
          source={IconComponent}
          uniProps={({ components }) => ({
            color: components.menu.item.icon.color,
          })}
        />
      </View>
    )
  }
)

const styles = StyleSheet.create(({ components }) => ({
  container: { justifyContent: 'center' },
  icon: {
    width: components.menu.extend.iconSize,
    height: components.menu.extend.iconSize,
  },
}))
