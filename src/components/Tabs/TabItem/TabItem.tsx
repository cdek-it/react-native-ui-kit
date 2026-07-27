import { memo, type ReactNode } from 'react'
import { Text, Pressable, View, type ViewProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { type SvgSource, SvgUniversal } from '../../../utils/SvgUniversal'

export interface TabItemProps {
  /** SVG-иконка */
  Icon?: SvgSource

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
              <SvgUniversal
                {...styles.icon}
                source={Icon}
                uniProps={({ theme }) => ({
                  color: disabled
                    ? theme.Button.disabledColor
                    : pressed
                      ? theme.Tabs.tab.hoverColor
                      : active
                        ? theme.Tabs.tab.activeColor
                        : theme.Tabs.tab.color,
                })}
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

const styles = StyleSheet.create(({ theme, typography, fonts }) => ({
  container: {
    alignItems: 'center',
    flexDirection: 'row',

    height: theme.Badge.height + theme.Tabs.tab.padding * 2,
    gap: theme.Tabs.tab.gap,
    paddingHorizontal: theme.Tabs.tab.padding,
    paddingVertical: theme.Tabs.tab.padding,

    backgroundColor: theme.Tabs.tab.background,
  },
  pressedContainer: { backgroundColor: theme.Tabs.tab.hoverBackground },
  activeContainer: { backgroundColor: theme.Tabs.tab.activeBackground },
  disabledContainer: { opacity: 0.6, mixBlendMode: 'luminosity' },
  icon: {
    width: typography.Size['text-xl'],
    height: typography.Size['text-xl'],
  },
  text: {
    fontFamily: fonts.primary,
    fontSize: typography.Size['text-base'],
    verticalAlign: 'middle',
    includeFontPadding: false,

    color: theme.Tabs.tab.color,
  },
  pressedText: { color: theme.Tabs.tab.hoverColor },
  activeText: { color: theme.Tabs.tab.activeColor },
  disabledText: { color: theme.Button.disabledColor },
}))

export enum TestId {
  Container = 'TabItem_Container',
}
