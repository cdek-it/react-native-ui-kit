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
                uniProps={({ components }) => ({
                  color: disabled
                    ? components.button.extend.disabledColor
                    : pressed
                      ? components.tabs.tab.hoverColor
                      : active
                        ? components.tabs.tab.activeColor
                        : components.tabs.tab.color,
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

// TODO(tokens-migration): reason=missing; legacy=components.button.extend.disabledColor; light=#85888e; dark=#a2a5a9
// TODO(tokens-migration): reason=missing; legacy=components.badge.root.height; value=24
// TODO(tokens-migration): reason=missing; legacy=fonts.primary; value=TT Fellows
// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-base; value=14
// TODO(tokens-migration): reason=missing; legacy=typography.Size.text-xl; value=17.5
const styles = StyleSheet.create(({ components, typography, fonts }) => ({
  container: {
    alignItems: 'center',
    flexDirection: 'row',

    height: components.badge.root.height + components.tabs.tab.padding * 2,
    gap: components.tabs.tab.gap,
    paddingHorizontal: components.tabs.tab.padding,
    paddingVertical: components.tabs.tab.padding,

    backgroundColor: components.tabs.colorScheme.tab.background,
  },
  pressedContainer: {
    backgroundColor: components.tabs.colorScheme.tab.hoverBackground,
  },
  activeContainer: {
    backgroundColor: components.tabs.colorScheme.tab.activeBackground,
  },
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

    color: components.tabs.tab.color,
  },
  pressedText: { color: components.tabs.tab.hoverColor },
  activeText: { color: components.tabs.tab.activeColor },
  disabledText: { color: components.button.extend.disabledColor },
}))

export enum TestId {
  Container = 'TabItem_Container',
}
