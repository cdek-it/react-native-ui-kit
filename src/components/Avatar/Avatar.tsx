import { type ComponentProps, memo, type ReactNode, useMemo } from 'react'
import {
  type AccessibilityProps,
  type ColorValue,
  Image,
  type ImageSourcePropType,
  type StyleProp,
  Text,
  View,
  type ViewStyle,
} from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { componentTokens } from '../../theme/tokens'
import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'

/** @deprecated Используйте base. */
type DeprecatedAvatarSize = 'normal'

/** Именованный размер Avatar. Для произвольного размера передавайте число в size. */
export type AvatarSize =
  | 'base'
  | 'large'
  | 'xlarge'
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Сохраняем совместимость публичного API до версии 2.0.
  | DeprecatedAvatarSize

type AvatarShape = 'square' | 'circle'

interface AvatarBase extends AccessibilityProps {
  /**
   * Размер: base, large, xlarge; число задаёт ширину и высоту.
   * @default 'base'
   */
  size?: AvatarSize | number
  /**
   * Форма: circle — круг, square — квадрат со скруглёнными углами.
   * @default 'circle'
   */
  shape?: AvatarShape
  /** Дополнительная стилизация внутреннего визуального контейнера */
  style?: StyleProp<ViewStyle>
  testID?: string
}

interface LabelAvatar extends AvatarBase {
  /** Текстовый вариант; требует строку children. */
  type: 'label'
  /** Текст в верхнем регистре; одна строка, обрезается без многоточия. */
  children: string
  /** Картинка */
  source?: never
  /** SVG-иконка */
  Icon?: never
  iconColor?: never
  onError?: never
}

interface IconAvatar extends AvatarBase {
  /** Вариант с обязательной SVG-иконкой Icon. */
  type: 'icon'
  /** Текст лейбла */
  children?: never
  /** Картинка */
  source?: never
  /** SVG типа SvgSource; встроенной иконки по умолчанию нет. */
  Icon: SvgSource
  /** Цвет иконки; по умолчанию цвет Avatar из текущей темы. */
  iconColor?: ColorValue
  onError?: never
}

/** Свойства варианта с изображением. */
interface ImageAvatar extends AvatarBase {
  /** Вариант с изображением; автоматической замены при ошибке загрузки нет. */
  type: 'image'
  /** Источник изображения, заполняющего Avatar с обрезкой по краям (cover). */
  source?: ImageSourcePropType
  /** Вызывается при ошибке загрузки; замену изображения задаёт потребитель. */
  onError?: ComponentProps<typeof Image>['onError']
  /** Текст лейбла */
  children?: never
  /** SVG-иконка */
  Icon?: never
  iconColor?: never
}

interface BadgeAvatar {
  /**
   * Содержимое бейджа в правом верхнем углу; null или undefined скрывают бейдж.
   */
  badge: ReactNode
  /** @deprecated Передавайте badge условно. */
  showBadge?: boolean
}

interface NoBadgeAvatar {
  badge?: never
  showBadge?: never
}

/** Свойства Avatar: вариант содержимого и необязательный слот badge. */
export type AvatarProps = (LabelAvatar | IconAvatar | ImageAvatar) &
  (BadgeAvatar | NoBadgeAvatar)

const ICON_MULTIPLIER = 0.43
const CUSTOM_ICON_SCALE_THRESHOLD = componentTokens.light.avatar.xl.width

/**
 * Аватар с изображением, иконкой или текстом.
 * Для самостоятельного значимого Avatar задавайте accessibilityLabel или aria-label:
 * без непустого имени он скрыт от скринридера. Роль всегда image.
 * Внутри Pressable имя и состояние задавайте родителю, оставляя Avatar без имени.
 * Badge и визуальное содержимое скрыты от скринридера; смысл badge включайте в имя.
 * Текст не масштабируется с системным размером шрифта.
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=36-1365
 */
export const Avatar = memo<AvatarProps>(
  ({
    type,
    size = 'base',
    shape = 'circle',
    style,
    children,
    source,
    Icon,
    badge,
    showBadge,
    testID,
    onError,
    iconColor,
    accessibilityLabel,
    'aria-label': ariaLabel,
    accessible,
    accessibilityElementsHidden,
    'aria-hidden': ariaHidden,
    importantForAccessibility,
    screenReaderFocusable,
    ...accessibilityProps
  }) => {
    const resolvedLabel = accessibilityLabel ?? ariaLabel
    const hidden =
      !resolvedLabel ||
      accessible === false ||
      accessibilityElementsHidden === true ||
      ariaHidden === true ||
      importantForAccessibility === 'no-hide-descendants'

    const sizeStyle = styles.size(size)
    const calculatedSize = sizeStyle.width

    const icon = useMemo(() => {
      if (type !== 'icon') {
        return null
      }

      let iconSize = styles.icon.width

      if (typeof size === 'number' && size > CUSTOM_ICON_SCALE_THRESHOLD) {
        iconSize = Math.round(calculatedSize * ICON_MULTIPLIER)
      } else if (size === 'xlarge') {
        iconSize = styles.iconXLarge.width
      }

      return (
        <SvgUniversal
          height={iconSize}
          source={Icon}
          testID={AvatarTestId.icon}
          uniProps={({ components }) => {
            return { color: iconColor ?? components.avatar.root.color }
          }}
          width={iconSize}
        />
      )
    }, [Icon, calculatedSize, iconColor, size, type])

    return (
      <View
        {...accessibilityProps}
        accessibilityElementsHidden={hidden}
        accessibilityLabel={resolvedLabel}
        accessibilityRole='image'
        accessible={!hidden}
        aria-hidden={hidden}
        collapsable={false}
        importantForAccessibility={
          hidden ? 'no-hide-descendants' : (importantForAccessibility ?? 'yes')
        }
        role='img'
        screenReaderFocusable={hidden ? false : (screenReaderFocusable ?? true)}
        style={sizeStyle}
        testID={testID || AvatarTestId.root}
      >
        <View
          accessibilityElementsHidden
          accessible={false}
          importantForAccessibility='no-hide-descendants'
          style={[
            styles.container,
            sizeStyle,
            styles.borderRadius(size, shape),
            type !== 'image' && styles.backgroundFill,
            style,
          ]}
          testID={AvatarTestId.container}
        >
          {type === 'label' && (
            <Text
              accessible={false}
              allowFontScaling={false}
              ellipsizeMode='clip'
              numberOfLines={1}
              style={styles.text(size)}
              testID={AvatarTestId.text}
            >
              {children}
            </Text>
          )}

          {icon}

          {type === 'image' && (
            <Image
              accessible={false}
              resizeMode='cover'
              source={source}
              style={sizeStyle}
              testID={AvatarTestId.image}
              onError={onError}
            />
          )}
        </View>

        {badge !== null && badge !== undefined && showBadge !== false ? (
          <View
            accessibilityElementsHidden
            accessible={false}
            importantForAccessibility='no-hide-descendants'
            style={styles.badgeContainer}
            testID={AvatarTestId.badgeContainer}
          >
            <View
              accessibilityElementsHidden
              accessible={false}
              importantForAccessibility='no-hide-descendants'
              testID={AvatarTestId.badgeInnerContainer}
            >
              {badge}
            </View>
          </View>
        ) : null}
      </View>
    )
  }
)

const styles = StyleSheet.create(({ components, semantic, fonts }) => {
  const normalizeSize = (size: AvatarSize | number): AvatarSize => {
    if (typeof size === 'string') return size

    if (size >= components.avatar.xl.width) return 'xlarge'

    if (size >= components.avatar.lg.width) return 'large'

    return 'base'
  }

  return {
    size: (size: AvatarSize | number) => {
      if (typeof size === 'number') {
        return { width: size, height: size }
      }

      let tokens: { width: number; height: number } = components.avatar.root

      switch (size) {
        case 'xlarge':
          tokens = components.avatar.xl
          break

        case 'large':
          tokens = components.avatar.lg
          break
      }

      return { width: tokens.width, height: tokens.height }
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: components.avatar.root.borderRadius,
      borderWidth: semantic.dimension.borderWidth[100],
      borderColor: components.avatar.extend.borderColor,
      backgroundColor: components.avatar.root.background,
      overflow: 'hidden',
    },
    borderRadius: (size: AvatarSize | number, shape: AvatarShape) => {
      if (shape === 'circle') {
        return { borderRadius: semantic.dimension.borderRadius.max }
      }

      const normalizedSize = normalizeSize(size)
      let borderRadius = components.avatar.root.borderRadius

      switch (normalizedSize) {
        case 'large':
          borderRadius = components.avatar.extend.lg.borderRadius
          break

        case 'xlarge':
          borderRadius = components.avatar.extend.xl.borderRadius
          break
      }

      return { borderRadius }
    },
    backgroundFill: { backgroundColor: components.avatar.root.background },
    text: (size: AvatarSize | number) => {
      const normalizedSize = normalizeSize(size)

      let fontSize = components.avatar.root.fontSize

      switch (normalizedSize) {
        case 'xlarge':
          fontSize = components.avatar.xl.fontSize
          break

        case 'large':
          fontSize = components.avatar.lg.fontSize
          break
      }

      return {
        fontSize,
        textTransform: 'uppercase',
        color: components.avatar.root.color,
        includeFontPadding: false,
        verticalAlign: 'middle',
        fontFamily: fonts.fontFamily.base,
        fontWeight: fonts.fontWeight.demibold,
        lineHeight: fonts.lineHeight[300],
      }
    },
    badgeContainer: { position: 'absolute', top: -10, right: -9.5 },
    icon: { width: components.avatar.icon.size },
    iconXLarge: { width: components.avatar.xl.icon.size },
  }
})

export const AvatarTestId = {
  root: 'Avatar',
  icon: 'Avatar.icon',
  container: 'Avatar.container',
  text: 'Avatar.text',
  image: 'Avatar.image',
  badgeContainer: 'Avatar.badgeContainer',
  badgeInnerContainer: 'Avatar.badgeInnerContainer',
}
