import { memo, useCallback, useState, type ReactNode } from 'react'
import {
  View,
  Pressable,
  type ViewProps,
  type ColorValue,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { StyleSheet, useUnistyles } from 'react-native-unistyles'

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
  /**
   * @deprecated Цвет основной иконки определяется состоянием пункта меню, как у аксессуаров.
   * Переданное значение игнорируется.
   */
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
  /**
   * Отключает нажатия и визуальное выделение, применяет обычные цвета с непрозрачностью 60%.
   * Аксессуары заменяются замками. Значение selected сохраняется в доступном состоянии.
   */
  disabled?: boolean
  /**
   * Выбранное состояние пункта, по умолчанию false.
   * Управляется потребителем и не меняется автоматически при нажатии.
   * Имеет приоритет над accessibilityState.selected и aria-selected.
   */
  selected?: boolean
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
 * Шаблон пункта меню с иконками, подписью и дополнительным содержимым.
 * Цвета текста, основной иконки и аксессуаров задаются темой по текущему состоянию.
 * Отслеживает нативный фокус и отображает выбранность из selected.
 * Нажатие вызывает onPress; accessibilityState.selected формируется из selected.
 *
 * @see https://www.figma.com/design/HOLKdvQJ8jCLeX17s9d0Yf/UI-Kit--DS--v2.0?node-id=937-6724
 */
export const MenuItemTemplate = memo<MenuItemTemplateProps>(
  ({
    title,
    caption,
    Icon,
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- исключаем устаревший проп из нативных props
    iconColor: _iconColor,
    badgeSeverity,
    PrefixIcon,
    SuffixIcon,
    extra,
    separator,
    testID,
    onPress,
    onFocus,
    onBlur,
    disabled,
    selected = false,
    accessibilityState,
    style,
    ...rest
  }) => {
    const { theme } = useUnistyles()
    const [focused, setFocused] = useState(false)
    const item = theme.theme.Menu.Item
    const handleFocus = useCallback<NonNullable<ViewProps['onFocus']>>(
      (event) => {
        setFocused(true)
        onFocus?.(event)
      },
      [onFocus]
    )
    const handleBlur = useCallback<NonNullable<ViewProps['onBlur']>>(
      (event) => {
        setFocused(false)
        onBlur?.(event)
      },
      [onBlur]
    )
    const getState = useCallback(
      (pressed: boolean): MenuItemState => {
        if (disabled) return 'default'

        if (selected) {
          return pressed || focused ? 'selectedHighlighted' : 'selected'
        }

        if (pressed) return 'pressed'

        return focused ? 'focused' : 'default'
      },
      [disabled, focused, selected]
    )

    const pressableStyle = useCallback(
      ({ pressed }: PressableStateCallbackType) => [
        styles.container(getState(pressed)),
        style,
        disabled && styles.containerDisabled,
      ],
      [disabled, getState, style]
    )

    return (
      <View style={separator ? styles.separator : null}>
        <Pressable
          accessibilityLabel={title}
          accessibilityRole='button'
          accessibilityState={{
            ...accessibilityState,
            selected,
            disabled: Boolean(disabled),
          }}
          accessibilityValue={{ text: caption }}
          disabled={disabled}
          style={pressableStyle}
          testID={testID || 'menuItemButton'}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onPress={onPress}
          {...rest}
          aria-selected={selected}
        >
          {({ pressed }) => {
            const state = getState(pressed)
            const stateIconColor =
              item[`${tokensByState[state].color}IconColor`]
            const iconStyle = {
              width: styles.icon.width,
              height: styles.icon.height,
              color: stateIconColor,
            }

            return (
              <View style={styles.contentContainer}>
                {PrefixIcon ? (
                  <MenuItemAccessory
                    Icon={PrefixIcon}
                    color={stateIconColor}
                    disabled={disabled}
                  />
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
                    <Body size='base' style={styles.title(state)}>
                      {title}
                    </Body>
                    {caption ? (
                      <Caption style={styles.caption}>{caption}</Caption>
                    ) : null}
                  </View>
                </View>
                {extra}
                {SuffixIcon ? (
                  <MenuItemAccessory
                    Icon={SuffixIcon}
                    color={stateIconColor}
                    disabled={disabled}
                  />
                ) : null}
              </View>
            )
          }}
        </Pressable>
      </View>
    )
  }
)

const tokensByState = {
  default: { color: 'menuitem', background: 'menuitemBg' },
  pressed: { color: 'menuitemHover', background: 'menuitemHoverBg' },
  focused: { color: 'menuitemFocus', background: 'menuitemFocusBg' },
  selected: { color: 'menuitemActive', background: 'menuitemActiveBg' },
  selectedHighlighted: {
    color: 'menuitemActive',
    background: 'menuitemActiveHoverBg',
  },
} as const

type MenuItemState = keyof typeof tokensByState

const styles = StyleSheet.create(({ theme, spacing, typography, border }) => ({
  container: (state: MenuItemState) => ({
    borderColor: theme.Menu.Item.menuitemBorderColor,
    borderWidth: border.Width.border,
    borderRadius: theme.Menu.Item.menuitemBorderRadius,
    backgroundColor: theme.Menu.Item[tokensByState[state].background],
  }),
  containerDisabled: { opacity: 0.6 },
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
  title: (state: MenuItemState) => ({
    color: theme.Menu.Item[`${tokensByState[state].color}TextColor`],
  }),
  caption: { color: theme.Menu.Common.menuTextColor },
  templateContainer: {
    flexDirection: 'row',
    gap: spacing.Gap['gap-2'],
    flex: 1,
  },
  icon: {
    width: typography.Size['text-xl'],
    height: typography.Size['text-xl'],
  },
  textContainer: { gap: spacing.Gap['gap-1'], flex: 1 },
}))
