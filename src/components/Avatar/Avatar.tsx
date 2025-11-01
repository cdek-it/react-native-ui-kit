import type { Icon } from '@tabler/icons-react-native'
import {
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  type AccessibilityProps,
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

interface AvatarBase extends AccessibilityProps {
  /**
   * Выбор размера компонента
   * @default 'normal'
   */
  size?: 'xlarge' | 'large' | 'normal'
  /**
   * Выбор форм-фактора компонента
   * @default 'circle'
   */
  shape?: 'square' | 'circle'
  /** Дополнительная стилизация для контейнера компонента */
  style?: ViewStyle
  testID?: string
}

interface LabelAvatar extends AvatarBase {
  /** Тип контента внутри компонента */
  type: 'label'
  /** Текст лейбла */
  children: string
  /** Картинка */
  source?: never
  /** Иконка из набора Tabler */
  Icon?: never
}

interface IconAvatar extends AvatarBase {
  /** Тип контента внутри компонента */
  type: 'icon'
  /** Текст лейбла */
  children?: never
  /** Картинка */
  source?: never
  /** Иконка из набора Tabler */
  Icon: Icon
}

/**
 * Свойства компонента с картинкой внутри
 */
interface ImageAvatar extends AvatarBase {
  /** Тип контента внутри компонент */
  type: 'image'
  /** Картинка */
  source?: ImageSourcePropType
  /** Текст лейбла */
  children?: never
  /** Иконка из набора Tabler */
  Icon?: never
}

interface BadgeAvatar {
  /** Компонент бейджа **/
  badge: ReactNode
  /** Показывать бейдж или нет */
  showBadge?: boolean
}

interface NoBadgeAvatar {
  /** Компонент бейджа **/
  badge?: never
  /** Показывать бейдж или нет */
  showBadge?: never
}

export type AvatarProps = (LabelAvatar | IconAvatar | ImageAvatar) &
  (BadgeAvatar | NoBadgeAvatar)

/**
 * Компонент Avatar
 * @param type - Тип контента внутри компонента
 * @param size - Выбор размера компонента
 * @param shape - Выбор форм-фактора компонента
 * @param style - Дополнительная стилизация для контейнера компонента
 * @param children - Текст лейбла
 * @param source - Картинка
 * @param Icon - Иконка из набора Tabler
 * @param badge - Компонент бейджа
 * @param showBadge - Показывать бейдж или нет
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-4972&m=dev
 */
export const Avatar = memo<AvatarProps>(
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
    testID,
  }) => {
    const styles = useStyles()
    const window = useWindowDimensions()
    const [badgeLayout, setBadgeLayout] = useState<LayoutRectangle>()

    const badgeContainerStyle = useMemo<ViewStyle>(
      () => ({
        left: badgeLayout?.width
          ? Math.round(styles[size].width - badgeLayout.width / 2)
          : 0,
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

      const iconStyle = StyleSheet.flatten([
        styles.icon,
        size === 'xlarge' && styles.iconXLarge,
      ])

      return (
        <Icon
          height={iconStyle.height}
          style={iconStyle}
          testID={AvatarTestId.icon}
          width={iconStyle.width}
        />
      )
    }, [Icon, size, styles.icon, styles.iconXLarge, type])

    useEffect(() => {
      if (badge) {
        setBadgeLayout(undefined)
      }
    }, [badge])

    return (
      <View collapsable={false} testID={testID || AvatarTestId.root}>
        <View
          style={[
            styles.container,
            styles[size],
            type !== 'image' && styles.backgroundFill,
            shape === 'circle' && styles.circle,
            style,
          ]}
          testID={AvatarTestId.container}
        >
          {type === 'label' && (
            <Text
              ellipsizeMode='clip'
              numberOfLines={1}
              style={[styles.text, size === 'xlarge' && styles.textXLarge]}
              testID={AvatarTestId.text}
            >
              {children}
            </Text>
          )}

          {icon}

          {type === 'image' && (
            <Image
              resizeMode='cover'
              source={source}
              style={styles[size]}
              testID={AvatarTestId.image}
            />
          )}
        </View>

        {badge && showBadge ? (
          <View
            style={[styles.badgeContainer, badgeContainerStyle]}
            testID={AvatarTestId.badgeContainer}
          >
            <View
              style={styles.badgeMeasureContainer}
              testID={AvatarTestId.badgeInnerContainer}
              onLayout={handleBadgeLayout}
            >
              {badge}
            </View>
          </View>
        ) : null}
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
  normal: { width: 28, height: 28 },
  large: {
    width: theme.Button.Common.buttonHeight,
    height: theme.Button.Common.buttonHeight,
  },
  xlarge: {
    width: theme.Button.Common.buttonHeightLG,
    height: theme.Button.Common.buttonHeightLG,
  },
  backgroundFill: { backgroundColor: theme.Misc.Avatar.avatarBg },
  circle: { borderRadius: 100 },
  text: {
    fontSize: 14,
    textTransform: 'uppercase',
    color: theme.Misc.Avatar.avatarTextColor,
    includeFontPadding: false,
    verticalAlign: 'middle',
  },
  textXLarge: { fontSize: 21 },
  badgeContainer: { position: 'absolute', right: 0, top: -7 },
  badgeMeasureContainer: { alignSelf: 'flex-start' },
  icon: { width: 14, height: 14, color: theme.Misc.Avatar.avatarTextColor },
  iconXLarge: {
    width: 21,
    height: 21,
    color: theme.Misc.Avatar.avatarTextColor,
  },
}))

export const AvatarTestId = {
  root: 'Avatar',
  icon: 'Avatar.icon',
  container: 'Avatar.container',
  text: 'Avatar.text',
  image: 'Avatar.image',
  badgeContainer: 'Avatar.badgeContainer',
  badgeInnerContainer: 'Avatar.badgeInnerContainer',
}
