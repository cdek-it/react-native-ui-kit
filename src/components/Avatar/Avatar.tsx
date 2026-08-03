import {
  type ComponentProps,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  type AccessibilityProps,
  type ColorValue,
  Image,
  type ImageSourcePropType,
  type LayoutChangeEvent,
  type LayoutRectangle,
  type StyleProp,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'

export type AvatarSize = 'xlarge' | 'large' | 'normal'

interface AvatarBase extends AccessibilityProps {
  /**
   * Выбор размера компонента
   * Можно передать число для кастомного размера аватара
   * @default 'normal'
   */
  size?: AvatarSize | number
  /**
   * Выбор форм-фактора компонента
   * @default 'circle'
   */
  shape?: 'square' | 'circle'
  /** Дополнительная стилизация для контейнера компонента */
  style?: StyleProp<ViewStyle>
  testID?: string
  /** Callback функция при ошибке загрузки картинки */
  onError?: ComponentProps<typeof Image>['onError']
}

interface LabelAvatar extends AvatarBase {
  /** Тип контента внутри компонента */
  type: 'label'
  /** Текст лейбла */
  children: string
  /** Картинка */
  source?: never
  /** SVG-иконка */
  Icon?: never
  iconColor?: never
}

interface IconAvatar extends AvatarBase {
  /** Тип контента внутри компонента */
  type: 'icon'
  /** Текст лейбла */
  children?: never
  /** Картинка */
  source?: never
  /** SVG-иконка */
  Icon: SvgSource
  /** Цвет иконки */
  iconColor?: ColorValue
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
  /** SVG-иконка */
  Icon?: never
  iconColor?: never
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

const SizeMap: Record<AvatarSize, number> = {
  normal: 28,
  large: 35,
  xlarge: 49,
}
const ICON_MULTIPLIER = 0.43

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
    onError,
    iconColor,
  }) => {
    const window = useWindowDimensions()
    const [badgeLayout, setBadgeLayout] = useState<LayoutRectangle>()

    const calculatedSize = useMemo(() => {
      if (typeof size === 'number') {
        return size
      }

      return SizeMap[size]
    }, [size])

    const sizeStyle = useMemo(
      () => ({ width: calculatedSize, height: calculatedSize }),
      [calculatedSize]
    )

    const badgeContainerStyle = useMemo<ViewStyle>(
      () => ({
        left: badgeLayout?.width
          ? Math.round(calculatedSize - badgeLayout.width / 2)
          : 0,
        width: badgeLayout?.width ? badgeLayout.width : window.width,
        height: badgeLayout?.width ? 'auto' : 0,
      }),
      [badgeLayout?.width, calculatedSize, window.width]
    )

    const handleBadgeLayout = useCallback(
      (e: LayoutChangeEvent) => setBadgeLayout(e.nativeEvent.layout),
      []
    )

    const icon = useMemo(() => {
      if (type !== 'icon') {
        return null
      }

      let iconSize = styles.icon.width

      if (typeof size === 'number' && size > SizeMap.xlarge) {
        iconSize = Math.round(calculatedSize * ICON_MULTIPLIER)
      } else if (size === 'xlarge') {
        iconSize = styles.iconXLarge.width
      }

      return (
        <SvgUniversal
          height={iconSize}
          source={Icon}
          testID={AvatarTestId.icon}
          uniProps={({ components }) => ({
            color: iconColor ?? components.avatar.root.color,
          })}
          width={iconSize}
        />
      )
    }, [Icon, calculatedSize, iconColor, size, type])

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
            sizeStyle,
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
              style={styles.text}
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
              style={sizeStyle}
              testID={AvatarTestId.image}
              onError={onError}
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

const styles = StyleSheet.create(
  ({ primitive, components, border, fonts }) => ({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: components.avatar.root.borderRadius,
      borderWidth: 1,
      borderColor: components.avatar.extend.borderColor,
      backgroundColor: components.avatar.root.background,
      overflow: 'hidden',
    },
    backgroundFill: { backgroundColor: components.avatar.root.background },
    // TODO(tokens-migration): reason=value-mismatch; legacy=border.Radius.rounded-full; value=100; target=components.avatar.extend.circle.borderRadius; targetValue=1600
    circle: { borderRadius: border.Radius['rounded-full'] },
    text: {
      // TODO(tokens-migration): reason=value-mismatch; legacy=typography.Size.text-base; value=14; target=components.avatar.root.fontSize; targetValue=16
      fontSize: primitive.fonts.fontSize[300],
      textTransform: 'uppercase',
      color: components.avatar.root.color,
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontFamily: fonts.secondary,
    },
    badgeContainer: { position: 'absolute', right: 0, top: -7 },
    badgeMeasureContainer: { alignSelf: 'flex-start' },
    icon: { width: primitive.fonts.fontSize[300] },
    // TODO(tokens-migration): reason=value-mismatch; legacy=typography.Size.text-2xl; value=21; target=components.avatar.xl.icon.size; targetValue=24
    iconXLarge: { width: primitive.fonts.fontSize[600] },
  })
)

export const AvatarTestId = {
  root: 'Avatar',
  icon: 'Avatar.icon',
  container: 'Avatar.container',
  text: 'Avatar.text',
  image: 'Avatar.image',
  badgeContainer: 'Avatar.badgeContainer',
  badgeInnerContainer: 'Avatar.badgeInnerContainer',
}
