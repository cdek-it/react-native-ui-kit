import type { Icon } from '@tabler/icons-react-native'
import React, { memo, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import {
  Image,
  type ImageSourcePropType,
  type LayoutChangeEvent,
  type LayoutRectangle,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

/**
 * Базовые свойства компонента Аватар
 */
interface AvatarBase {
  /**
   * Выбор размера компонента
   * @default 'normal'
   */
  size?: 'xlarge' | 'large' | 'normal'
  /**
   * Выбор форм-фактора компонента
   * @default 'circ'e
   */
  shape?: 'square' | 'circle'
  /**
   * Дополнительная стилизация для контейнера компонента
   */
  style?: ViewStyle
}

/**
 * Свойства компонента с лейблом внутри
 */
interface LabelAvatar extends AvatarBase {
  /**
   * Тип контента внутри компонента
   */
  type: 'label'
  /**
   * Текст лейбла
   */
  children: string
  /**
   * Картинка
   */
  source?: never
  /**
   * Иконка из набора Tabler
   */
  Icon?: never
}

/**
 * Свойства компонента с иконкой внутри
 */
interface IconAvatar extends AvatarBase {
  /**
   * Тип контента внутри компонента
   */
  type: 'icon'
  /**
   * Текст лейбла
   */
  children?: never
  /**
   * Картинка
   */
  source?: never
  /**
   * Иконка из набора Tabler
   */
  Icon: Icon
}

/**
 * Свойства компонента с картинкой внутри
 */
interface ImageAvatar extends AvatarBase {
  /**
   * Тип контента внутри компонента
   */
  type: 'image'
  /**
   * Картинка
   */
  source?: ImageSourcePropType
  /**
   * Текст лейбла
   */
  children?: never
  /**
   * Иконка из набора Tabler
   */
  Icon?: never
}

/**
 * Свойства компонента для интеграции бейджа
 */
interface BadgeAvatar {
  badge: ReactNode
  showBadge?: boolean
}

/**
 * Свойства компонента без бейджа
 */
interface NoBadgeAvatar {
  badge?: never
  showBadge?: never
}

/**
 * Свойства компонента Аватар
 */
export type AvatarProps = (LabelAvatar | IconAvatar | ImageAvatar) & (BadgeAvatar | NoBadgeAvatar)

/**
 * Компонент Avatar
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-4972&m=dev
 */
export const Avatar = memo(
  ({
    type,
    size = 'normal',
    shape = 'circle',
    style,
    children,
    source,
    Icon,
    badge,
    showBadge = true,
  }: AvatarProps) => {
    const styles = useStyles()
    const window = useWindowDimensions()
    const [badgeLayout, setBadgeLayout] = useState<LayoutRectangle>()

    const badgeContainerStyle = useMemo<ViewStyle>(
      () => ({
        left: badgeLayout?.width ? Math.round(styles[size].width - badgeLayout.width / 2) : 0,
        width: badgeLayout?.width ? badgeLayout.width : window.width,
        height: badgeLayout?.width ? 'auto' : 0,
      }),
      [badgeLayout?.width, size, styles, window.width]
    )

    const handleBadgeLayout = useCallback(
      (e: LayoutChangeEvent) => setBadgeLayout(e.nativeEvent.layout),
      []
    )

    const icon = useMemo(() => {
      if (type !== 'icon') {
        return null
      }

      const iconStyle = StyleSheet.flatten([styles.icon, size === 'xlarge' && styles.iconXLarge])

      return <Icon height={iconStyle.height} style={iconStyle} width={iconStyle.width} />
    }, [Icon, size, styles.icon, styles.iconXLarge, type])

    useEffect(() => {
      if (badge) {
        setBadgeLayout(undefined)
      }
    }, [badge])

    return (
      <View collapsable={false}>
        <View
          style={[
            styles.container,
            styles[size],
            type !== 'image' && styles.backgroundFill,
            shape === 'circle' && styles.circle,
            style,
          ]}
        >
          {type === 'label' && (
            <Text
              ellipsizeMode='clip'
              numberOfLines={1}
              style={[styles.text, size === 'xlarge' && styles.textXLarge]}
            >
              {children}
            </Text>
          )}

          {icon}

          {type === 'image' && <Image resizeMode='cover' source={source} style={[styles[size]]} />}
        </View>

        {badge && showBadge && (
          <View style={[styles.badgeContainer, badgeContainerStyle]}>
            <View style={styles.badgeMeasureContainer} onLayout={handleBadgeLayout}>
              {badge}
            </View>
          </View>
        )}
      </View>
    )
  }
)

const useStyles = makeStyles(({ theme }) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.General.borderRadius,
    borderWidth: 1,
    borderColor: theme.Misc.Avatar.avatarBorderColor,
    backgroundColor: theme.Misc.Avatar.avatarBg,
    overflow: 'hidden',
  },
  normal: {
    width: 28,
    height: 28,
  },
  large: {
    width: theme.Button.Common.buttonHeight,
    height: theme.Button.Common.buttonHeight,
  },
  xlarge: {
    width: theme.Button.Common.buttonHeightLG,
    height: theme.Button.Common.buttonHeightLG,
  },
  backgroundFill: {
    backgroundColor: theme.Misc.Avatar.avatarBg,
  },
  circle: {
    borderRadius: 100,
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 14,
    textTransform: 'uppercase',
    color: theme.Misc.Avatar.avatarTextColor,
  },
  textXLarge: {
    fontSize: 21,
  },
  badgeContainer: {
    position: 'absolute',
    right: 0,
    top: -7,
  },
  badgeMeasureContainer: {
    alignSelf: 'flex-start',
  },
  icon: {
    width: 14,
    height: 14,
    color: theme.Misc.Avatar.avatarTextColor,
  },
  iconXLarge: {
    width: 21,
    height: 21,
    color: theme.Misc.Avatar.avatarTextColor,
  },
}))
