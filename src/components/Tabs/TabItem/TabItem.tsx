import type { Icon } from '@tabler/icons-react-native'
import React, { memo, useContext, type ReactNode } from 'react'
import { Text, Pressable, View } from 'react-native'

import { makeStyles } from '../../../utils/makeStyles'
import { TabsContext } from '../Tabs'

export interface TabItemProps {
  /** Иконка из библиотеки Tabler */
  Icon?: Icon

  /** Текст для отображения */
  label: string

  /** Компонент бейджа **/
  badge?: ReactNode

  /** Индекс этой табы **/
  index: number
}

/** Часть навигационного компонента Tabs
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=888-13076&t=hIQjdrqPKK8BWYev-4
 */
export const TabItem = memo<TabItemProps>(({ Icon, label, badge, index, ...rest }) => {
  const context = useContext(TabsContext)
  const styles = useStyles()
  const active = (() => {
    return context.activeIndex === index
  })()

  const iconColor = (pressed: boolean) => {
    if (context.disabled) return styles.disabledIcon.color
    if (pressed) return styles.highlightIcon.color
    if (active) return styles.activeIcon.color
    return styles.icon.color
  }

  return (
    <Pressable
      {...rest}
      disabled={context.disabled}
      testID={TestId.Container + index}
      onPress={() => context.onChange(index)}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.container,
            pressed && styles.highlightContainer,
            active && styles.activeContainer,
            context.disabled && styles.disabledContainer,
          ]}
        >
          {Icon && (
            <Icon
              color={iconColor(pressed)}
              height={styles.icon.height}
              width={styles.icon.width}
            />
          )}
          <View style={styles.textContainer}>
            <Text
              numberOfLines={1}
              style={[
                styles.text,
                active && styles.activeText,
                pressed && styles.highlightText,
                context.disabled && styles.disabledText,
              ]}
            >
              {label}
            </Text>
          </View>
          {badge}
        </View>
      )}
    </Pressable>
  )
})

const useStyles = makeStyles(({ theme, typography }) => ({
  container: {
    flexWrap: 'wrap',
    alignItems: 'center',
    flexDirection: 'row',

    gap: theme.General.inlineSpacing,
    paddingHorizontal: theme.Panel.TabView.tabviewHeaderPaddingLeftRight,
    paddingVertical: theme.Panel.TabView.tabviewHeaderPaddingTopBottom,

    borderBottomWidth: theme.Panel.TabView.tabviewHeaderBorderWidth,

    backgroundColor: theme.Panel.TabView.tabviewHeaderBg,
    borderColor: theme.Panel.TabView.tabviewHeaderBorderColor,
  },
  highlightContainer: {
    backgroundColor: theme.Panel.TabView.tabviewHeaderHoverBg,
    borderColor: theme.Panel.TabView.tabviewHeaderHoverBorderColor,
  },
  activeContainer: {
    backgroundColor: theme.Panel.TabView.tabviewHeaderActiveBg,
    borderColor: theme.Panel.TabView.tabviewHeaderActiveBorderColor,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  icon: {
    width: theme.Menu.Item.menuitemSubmenuIconFontSize,
    height: theme.Menu.Item.menuitemSubmenuIconFontSize,
    color: theme.Panel.TabView.tabviewHeaderTextColor,
  },
  highlightIcon: {
    color: theme.Panel.TabView.tabviewHeaderHoverTextColor,
  },
  activeIcon: {
    color: theme.Panel.TabView.tabviewHeaderActiveTextColor,
  },
  disabledIcon: {
    color: theme.Button.Disabled.disabledButtonTextColor,
  },
  textContainer: {
    height: theme.Misc.Badge.badgeHeight,
  },
  text: {
    fontSize: typography.Size['text-base'],
    verticalAlign: 'middle',
    includeFontPadding: false,

    color: theme.Panel.TabView.tabviewHeaderTextColor,
  },
  highlightText: {
    color: theme.Panel.TabView.tabviewHeaderHoverTextColor,
  },
  activeText: {
    color: theme.Panel.TabView.tabviewHeaderActiveTextColor,
  },
  disabledText: {
    color: theme.Button.Disabled.disabledButtonTextColor,
  },
}))

export enum TestId {
  Container = 'TabItem_Container',
}
