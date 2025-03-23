import type { Icon } from '@tabler/icons-react-native'
import { memo, useCallback, type ReactNode } from 'react'
import { Text, Pressable, View, type ViewProps } from 'react-native'

import { makeStyles } from '../../../utils/makeStyles'

export interface TabItemProps {
  /** Иконка из библиотеки Tabler */
  Icon?: Icon

  /** Текст для отображения */
  label: string

  /** Компонент бейджа **/
  badge?: ReactNode

  /** Индекс этой табы **/
  index: number

  /** Обработчик нажатия на кнопку */
  onPress: (index: number) => void

  /** Признак доступности компонента */
  disabled?: boolean

  /** Признак активен ли компонент */
  active?: boolean

  onLayout?: ViewProps['onLayout']
}

// Часть навигационного компонента Tabs
// @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=888-13076&t=hIQjdrqPKK8BWYev-4
//
export const TabItem = memo<TabItemProps>(
  ({ Icon, label, badge, index, onPress, disabled, active, onLayout }) => {
    const styles = useStyles()

    const getIconColor = useCallback(
      (pressed: boolean) => {
        if (disabled) {
          return styles.disabledIcon.color
        }

        if (pressed) {
          return styles.pressedIcon.color
        }

        if (active) {
          return styles.activeIcon.color
        }

        return styles.icon.color
      },
      [disabled, active, styles]
    )

    return (
      <Pressable
        accessibilityRole='button'
        disabled={disabled}
        testID={TestId.Container + index}
        onLayout={onLayout}
        onPress={() => onPress(index)}
      >
        {({ pressed }) => (
          <View
            style={[
              styles.container,
              pressed && styles.pressedContainer,
              active && styles.activeContainer,
              disabled && styles.disabledContainer,
            ]}
          >
            {Icon ? (
              <Icon
                color={getIconColor(pressed)}
                height={styles.icon.height}
                width={styles.icon.width}
              />
            ) : null}
            <Text
              numberOfLines={1}
              style={[
                styles.text,
                active && styles.activeText,
                pressed && styles.pressedText,
                disabled && styles.disabledText,
              ]}
            >
              {label}
            </Text>
            {badge}
          </View>
        )}
      </Pressable>
    )
  }
)

const useStyles = makeStyles(({ theme, typography }) => ({
  container: {
    alignItems: 'center',
    flexDirection: 'row',

    height:
      theme.Misc.Badge.badgeHeight +
      theme.Panel.TabView.tabviewHeaderPaddingTopBottom * 2,
    gap: theme.General.inlineSpacing,
    paddingHorizontal: theme.Panel.TabView.tabviewHeaderPaddingLeftRight,
    paddingVertical: theme.Panel.TabView.tabviewHeaderPaddingTopBottom,

    backgroundColor: theme.Panel.TabView.tabviewHeaderBg,
  },
  pressedContainer: {
    backgroundColor: theme.Panel.TabView.tabviewHeaderHoverBg,
  },
  activeContainer: {
    backgroundColor: theme.Panel.TabView.tabviewHeaderActiveBg,
  },
  disabledContainer: { opacity: 0.6 },
  icon: {
    width: theme.Menu.Item.menuitemSubmenuIconFontSize,
    height: theme.Menu.Item.menuitemSubmenuIconFontSize,
    color: theme.Panel.TabView.tabviewHeaderTextColor,
  },
  pressedIcon: { color: theme.Panel.TabView.tabviewHeaderHoverTextColor },
  activeIcon: { color: theme.Panel.TabView.tabviewHeaderActiveTextColor },
  disabledIcon: { color: theme.Button.Disabled.disabledButtonTextColor },
  text: {
    fontSize: typography.Size['text-base'],
    verticalAlign: 'middle',
    includeFontPadding: false,

    color: theme.Panel.TabView.tabviewHeaderTextColor,
  },
  pressedText: { color: theme.Panel.TabView.tabviewHeaderHoverTextColor },
  activeText: { color: theme.Panel.TabView.tabviewHeaderActiveTextColor },
  disabledText: { color: theme.Button.Disabled.disabledButtonTextColor },
}))

export enum TestId {
  Container = 'TabItem_Container',
}
