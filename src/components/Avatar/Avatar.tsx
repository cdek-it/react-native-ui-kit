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

interface AvatarBase {
  size?: 'xlarge' | 'large' | 'normal'
  shape?: 'square' | 'circle'
  style?: ViewStyle
}

interface LabelAvatar extends AvatarBase {
  type: 'label'
  children: string
  source?: never
  Icon?: never
}

interface IconAvatar extends AvatarBase {
  type: 'icon'
  children?: never
  source?: never
  Icon: Icon
}

interface ImageAvatar extends AvatarBase {
  type: 'image'
  source?: ImageSourcePropType
  children?: never
  Icon?: never
}

interface BadgeAvatar {
  badge: ReactNode
  showBadge?: boolean
}

interface NoBadgeAvatar {
  badge?: never
  showBadge?: never
}

export type AvatarProps = (LabelAvatar | IconAvatar | ImageAvatar) & (BadgeAvatar | NoBadgeAvatar)

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
