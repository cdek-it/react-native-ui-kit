import type { Icon } from '@tabler/icons-react-native'
import { useCallback, useMemo, useState } from 'react'
import {
  type ColorValue,
  type DimensionValue,
  type LayoutChangeEvent,
  View,
  StyleSheet,
} from 'react-native'

import { makeStyles } from '../../utils/makeStyles'
import { Badge, type BadgeSeverity } from '../Badge/Badge'

interface MenuItemIconStyle {
  /** Ширина иконки в поинтах*/
  width?: number
  /** Высота иконки в поинтах*/
  height?: number
  /** Цвет иконки*/
  color?: ColorValue
}

interface MenuItemIconProps {
  /**
   * Иконка из набора tabler
   * @type {Icon}
   */
  readonly Icon: Icon
  /**
   * Стиль иконки
   */
  readonly style: MenuItemIconStyle
  /**
   * Цвет бейджа
   *
   * @type {BadgeSeverity}
   */
  readonly badgeSeverity?: BadgeSeverity
}

/**
 * Иконка в составе элемента меню. Состоит из центрирующего враппера, иконки и опционального бейджа (точки)
 * @param Icon - Иконка из набора Tabler
 * @param style - Стиль иконки
 * @param badgeSeverity - Цвет бейджа (undefined если бейдж не нужен)
 */
export const MenuItemIcon = ({
  Icon,
  style,
  badgeSeverity,
}: MenuItemIconProps) => {
  const styles = useStyles()

  const [badgePosition, setBadgePosition] = useState<{
    top: DimensionValue
    right: DimensionValue
  }>({ top: 0, right: 0 })

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setBadgePosition({ top: -width / 2, right: -height / 2 })
  }, [])

  const badgeStyle = useMemo(
    () =>
      StyleSheet.flatten([
        styles.badge,
        { top: badgePosition.top, right: badgePosition.right },
      ]),
    [badgePosition.right, badgePosition.top, styles.badge]
  )

  return (
    <View style={styles.container}>
      <View>
        <Icon {...style} />
        {badgeSeverity ? (
          <Badge
            dot
            severity={badgeSeverity}
            style={badgeStyle}
            testID='MenuItemIconBadge'
            onLayout={onLayout}
          />
        ) : null}
      </View>
    </View>
  )
}

const useStyles = makeStyles(() => ({
  container: { justifyContent: 'center', position: 'relative' },

  badge: { position: 'absolute' },
}))
