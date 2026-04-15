import { memo, useCallback, useMemo, type ReactNode } from 'react'
import {
  View,
  Pressable,
  type ViewProps,
  type ColorValue,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { StyleSheet } from '../../../utils'
import type { SvgSource } from '../../../utils/SvgUniversal'
import type { BadgeSeverity } from '../../Badge/Badge'
import { Body, Caption } from '../../Typography'
import { MenuItemAccessory } from '../MenuItemAccessory'
import { MenuItemIcon } from '../MenuItemIcon'

export interface MenuItemTemplateProps extends ViewProps {
  /** Заголовок пункта меню */
  title: string
  /** Подзаголовок пункта меню */
  caption?: string
  /** SVG-иконка слева от заголовка */
  Icon?: SvgSource
  /** Цвет иконки. Если цвет не задан - применяется такой же цвет что и для аксессуаров (prefix, suffix) */
  iconColor?: ColorValue
  /** Цвет бейджа (точки) в правом верхнем углу иконки. Бейдж может выводиться только при наличии иконки. */
  badgeSeverity?: BadgeSeverity
  /** Аксессуар (SVG-иконка) в самой левой части пункта меню */
  PrefixIcon?: SvgSource
  /** Аксессуар (SVG-иконка) в самой правой части пункта меню */
  SuffixIcon?: SvgSource
  /**
   * Дополнительный контент пункта меню, выводится справа от текста. Может быть любым react компонентом. Важно! Размеры доплолнительного контента не контролируются пунктом меню и могут его растягивать. Использовать с осторожностью.
   */
  extra?: ReactNode
  /** Неактивное состояние. В неактивном состоянии отключается чувствительность к нажатиям, компонент становится полупрозрачным, а аксессуары заменяются иконкой с замком*/
  disabled?: boolean
  /** Разделитель. Выводится как полоска сверху. Изменяет общую высоту элемента меню.*/
  separator?: boolean
  /** Обработчик нажатия */
  onPress?: () => void
  /**
   * Кастомные стили
   * Если нужно изменить отступы, не используйте `padding`.
   * Допускается использовать `paddingVertical`, `paddingHorizontal`, `paddingStart`, `paddingEnd`, `paddingLeft`, `paddingRight`, `paddingTop`, `paddingBottom`.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Шаблон элемента меню. Содержит максимальное количество компонентов внутри пункта меню и используется как основа для создания пунктов меню любой возможной конфигурации.
 *
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=937-6724&m=dev
 */
export const MenuItemTemplate = memo<MenuItemTemplateProps>(
  ({
    title,
    caption,
    Icon,
    iconColor,
    badgeSeverity,
    PrefixIcon,
    SuffixIcon,
    extra,
    separator,
    testID,
    onPress,
    disabled,
    style,
    ...rest
  }) => {
    const iconStyle = useMemo(
      () => ({
        width: styles.icon.width,
        height: styles.icon.height,
        color: iconColor || styles.icon.color,
      }),
      [iconColor]
    )

    const pressableStyle = useCallback(
      ({ pressed }: PressableStateCallbackType) => [
        styles.container,
        pressed && styles.containerPressed,
        style,
        disabled && styles.containerDisabled,
      ],
      [disabled, style]
    )

    return (
      <View style={separator ? styles.separator : null}>
        <Pressable
          accessibilityLabel={title}
          accessibilityRole='button'
          accessibilityValue={{ text: caption }}
          disabled={disabled}
          style={pressableStyle}
          testID={testID || 'menuItemButton'}
          onPress={onPress}
          {...rest}
        >
          <View style={styles.contentContainer}>
            {PrefixIcon ? (
              <MenuItemAccessory Icon={PrefixIcon} disabled={disabled} />
            ) : null}
            <View style={styles.templateContainer}>
              {Icon ? (
                <MenuItemIcon
                  Icon={Icon}
                  badgeSeverity={badgeSeverity}
                  style={iconStyle}
                />
              ) : null}
              <View style={styles.textContainer}>
                <Body base>{title}</Body>
                {caption ? (
                  <Caption color='secondary'>{caption}</Caption>
                ) : null}
              </View>
            </View>
            {extra}
            {SuffixIcon ? (
              <MenuItemAccessory Icon={SuffixIcon} disabled={disabled} />
            ) : null}
          </View>
        </Pressable>
      </View>
    )
  }
)

const styles = StyleSheet.create(({ theme, spacing, typography, border }) => ({
  container: {
    borderColor: theme.Menu.Item.menuitemBorderColor,
    borderWidth: border.Width.border,
    borderRadius: theme.Menu.Item.menuitemBorderRadius,
    backgroundColor: theme.Menu.Item.menuitemBg,
  },
  containerPressed: { backgroundColor: theme.Menu.Item.menuitemHoverBg },
  containerDisabled: {
    borderColor: theme.Button.Disabled.disabledButtonBorderColor,
    backgroundColor: theme.Button.Disabled.disabledButtonBg,
    opacity: 0.6,
  },
  separator: {
    borderTopWidth: 1,
    borderTopColor: theme.Menu.Overlay.overlayMenuBorderColor,
    paddingTop: theme.Menu.Common.menuSeparatorMarginTopBottom,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.General.inlineSpacing,
    paddingHorizontal: theme.Menu.Item.menuitemPaddingLeftRight,
    paddingVertical: theme.Menu.Item.menuitemPaddingTopBottom,
  },
  accessory: {
    color: theme.Menu.Item.menuitemIconColor,
    width: theme.Menu.Item.menuitemSubmenuIconFontSize,
    height: theme.Menu.Item.menuitemSubmenuIconFontSize,
  },
  templateContainer: {
    flexDirection: 'row',
    gap: spacing.Gap['gap-2'],
    flex: 1,
  },
  icon: {
    width: typography.Size['text-xl'],
    height: typography.Size['text-xl'],
    color: theme.Menu.Item.menuitemIconColor,
  },
  textContainer: { gap: spacing.Gap['gap-1'], flex: 1 },
}))
