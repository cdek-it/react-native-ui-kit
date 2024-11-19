import type { Icon } from '@tabler/icons-react-native'
import React, { memo } from 'react'
import { View, Text, Pressable, type ViewProps } from 'react-native'

import { makeStyles } from '../../../utils/makeStyles'
import type { BadgeSeverity } from '../../Badge/Badge'
import { type MenuItemTemplateAccessory, MenuItemAccessory } from '../MenuItemAccessory'
import { MenuItemIcon } from '../MenuItemIcon'

export type MenuItemTemplateState = 'default' | 'disabled'

/** Свойства MenuItemTemplate */
export interface MenuItemTemplateProps extends ViewProps {
  /** Заголовок пункта меню */
  title: string
  /** Подзаголовок пункта меню */
  caption?: string
  /** Иконка слева от заголовка. Допустимы только иконки из набора tabler */
  Icon?: Icon
  /** Цвет бейджа (точки) в правом верхнем углу иконки. Бейдж может выводиться только при наличии иконки. */
  badgeSeverity?: BadgeSeverity
  /** Аксессуар в самой левой части пункта меню (стрелка вниз или вправо) */
  prefix?: MenuItemTemplateAccessory
  /** Аксессуар в самойправой части пункта меню (стрелка вниз или вправо) */
  suffix?: MenuItemTemplateAccessory
  /** Дополнительный контент пункта меню, выводится справа от текста. Может быть любым react компонентом. Важно! Размеры доплолнительного контента не контролируются пунктом меню и могут его растягивать. Использовать с осторожностью. */
  extra?: React.ReactNode
  /** Разделитель. Выводится как полоска сверху. Изменяет общую высоту элемента меню.*/
  separator?: boolean
  /**  Состояние 'default' | 'disabled' */
  state?: MenuItemTemplateState
  /** Обработчик нажатия */
  onPress?: () => void
}

/**
 * Шаблон элемента меню. Содержит максимальное количество компонентов внутри пункта меню и используется как основа для создания пунктов меню любой возможной конфигурации.
 *
 * @param title - Заголовок пункта меню
 * @param caption - Подзаголовок пункта меню
 * @param Icon - Иконка слева от заголовка. Допустимы только иконки из набора tabler
 * @param badgeSeverity - Цвет бейджа (точки) в правом верхнем углу иконки. Бейдж может выводиться только при наличии иконки.
 * @param prefix - Аксессуар в самой левой части пункта меню (стрелка вниз или вправо)
 * @param suffix - Аксессуар в самой правой части пункта меню (стрелка вниз или вправо)
 * @param extra - Дополнительный контент пункта меню, выводится справа от текста. Может быть любым react компонентом. Важно! Размеры доплолнительного контента не контролируются пунктом меню и могут его растягивать. Использовать с осторожностью.
 * @param separator - Разделитель. Выводится как полоска сверху. Изменяет общую высоту элемента меню.
 * @param state - Состояние 'default' | 'disabled'. В состоянии 'disabled' отключается чувствительность к нажатиям, компонент становится полупрозрачным, а аксессуары заменяются иконкой с замком
 * @param onPress - Обработчик нажатия
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=937-6724&m=dev
 */
export const MenuItemTemplate = memo<MenuItemTemplateProps>(
  ({
    title,
    caption,
    Icon,
    badgeSeverity,
    prefix = 'none',
    suffix = 'none',
    extra,
    separator = false,
    state = 'default',
    onPress = undefined,
    ...rest
  }) => {
    const styles = useStyles()

    const disabled = state === 'disabled'
    const maybeDisabled = disabled ? styles.disabled : null

    return (
      <View style={separator && styles.separator}>
        <Pressable
          accessibilityLabel={title}
          accessibilityRole='button'
          accessibilityValue={{ text: caption }}
          disabled={disabled}
          testID='menuItemButton'
          onPress={onPress}
          {...rest}
        >
          <View style={[styles.contentContainer, maybeDisabled]}>
            <View style={styles.leftContainer}>
              <MenuItemAccessory disabled={disabled} iconStyle={styles.accessory} type={prefix} />
              <View style={styles.templateContainer}>
                {Icon !== undefined && (
                  <MenuItemIcon Icon={Icon} badgeSeverity={badgeSeverity} style={styles.icon} />
                )}
                <View style={styles.textContainer}>
                  <Text style={[styles.title, styles.titleColor]}>{title}</Text>
                  <Text style={[styles.caption, styles.captionColor]}>{caption}</Text>
                </View>
                {extra}
              </View>
            </View>
            <MenuItemAccessory disabled={disabled} iconStyle={styles.accessory} type={suffix} />
          </View>
        </Pressable>
      </View>
    )
  }
)

const useStyles = makeStyles(({ theme, spacing, typography }) => ({
  separator: {
    borderTopWidth: 1,
    borderTopColor: theme.Menu.Overlay.overlayMenuBorderColor,
    paddingTop: spacing.Gap['gap-1'],
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    gap: theme.General.inlineSpacing,
    paddingHorizontal: theme.Menu.Item.menuitemPaddingLeftRight,
    paddingVertical: theme.Menu.Item.menuitemPaddingTopBottom,
    borderColor: theme.Menu.Item.menuitemBorderColor,
    borderWidth: 1, // theme.Menu.Item.menuitemBorder, - установить когда там будет числовое значение
    borderRadius: theme.Menu.Item.menuitemBorderRadius,
    backgroundColor: theme.Menu.Item.menuitemBg,
  },
  disabled: {
    borderWidth: 1,
    borderColor: theme.Button.Disabled.disabledButtonBorderColor,
    backgroundColor: theme.Button.Disabled.disabledButtonBg,
    opacity: 0.6,
  },
  leftContainer: {
    flexDirection: 'row',
  },
  accessory: {
    color: theme.Menu.Item.menuitemIconColor,
    width: theme.Menu.Item.menuitemSubmenuIconFontSize,
    height: theme.Menu.Item.menuitemSubmenuIconFontSize,
  },
  templateContainer: {
    flexDirection: 'row',
    gap: spacing.Gap['gap-2'],
  },
  icon: {
    width: typography.Size['text-xl'],
    height: typography.Size['text-xl'],
    color: theme.Menu.Item.menuitemIconColor,
  },
  textContainer: {
    flexDirection: 'column',
    gap: spacing.Gap['gap-1'],
  },
  title: {
    fontSize: 14,
    textAlign: 'left',
    includeFontPadding: false,
    verticalAlign: 'middle',
  },
  titleColor: {
    color: theme.Menu.Item.menuitemTextColor,
  },
  caption: {
    fontSize: 12,
    textAlign: 'left',
    includeFontPadding: false,
    verticalAlign: 'middle',
  },
  captionColor: {
    color: theme.Menu.Item.menuitemTextColor,
  },
}))
