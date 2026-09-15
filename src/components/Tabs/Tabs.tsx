import { memo, useEffect, useState } from 'react'
import {
  type AccessibilityProps,
  type LayoutChangeEvent,
  type LayoutRectangle,
  View,
  type ViewProps,
} from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { StyleSheet } from 'react-native-unistyles'

import { TabItem, type TabItemProps } from './TabItem/TabItem'

export interface TabsProps
  extends AccessibilityProps, Pick<ViewProps, 'testID'> {
  /** Список табов см. компонент TabItem */
  items: Array<Pick<TabItemProps, 'Icon' | 'label' | 'badge'> & { key: string }>

  /** Текущий активный индекс */
  activeIndex: number

  /** Функция вызывается при нажатии на таб, при этом сам таб не переключается */
  onChange: (index: number) => void

  /** Признак доступности компонента */
  disabled?: boolean
}

// Навигационный компонент Tabs
// @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=888-13076&t=hIQjdrqPKK8BWYev-4
// @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=24043-2196
//
export const Tabs = memo<TabsProps>(
  ({ items, disabled = false, activeIndex, onChange, testID, ...rest }) => {
    const [tabsLayouts, setTabsLayouts] = useState<
      Record<string, LayoutRectangle>
    >({})

    const lineSharedValue = useSharedValue(activeIndex)

    const animatedStyles = useAnimatedStyle(() => {
      return {
        width: interpolate(
          lineSharedValue.value,
          items.map((_, index) => index),
          items.map(({ key }) => tabsLayouts[key]?.width ?? 0)
        ),
        left: interpolate(
          lineSharedValue.value,
          items.map((_, index) => index),
          items.map(({ key }) => tabsLayouts[key]?.x ?? 0)
        ),
      }
    })

    useEffect(() => {
      lineSharedValue.value = withTiming(activeIndex)
    }, [activeIndex, tabsLayouts, lineSharedValue, items])

    const handleTabLayout = (e: LayoutChangeEvent, key: string) => {
      e.persist()

      setTabsLayouts((prevTabsLayouts) => {
        return { ...prevTabsLayouts, [key]: e.nativeEvent.layout }
      })
    }

    return (
      <View {...rest} style={styles.container} testID={testID}>
        {items.map((prop, index) => {
          return (
            <TabItem
              {...prop}
              active={activeIndex === index}
              disabled={disabled}
              index={index}
              key={prop.key}
              onLayout={(e) => handleTabLayout(e, prop.key)}
              onPress={onChange}
            />
          )
        })}
        <Animated.View style={[styles.line, animatedStyles]} />
      </View>
    )
  }
)

const styles = StyleSheet.create(({ components }) => ({
  container: {
    flexDirection: 'row',
    gap: components.tabs.tab.margin,

    borderBottomWidth: components.tabs.tablist.borderBottomWidth,
    borderColor: components.tabs.tablist.borderColor,
  },
  line: {
    position: 'absolute',
    // Линия ложится поверх границы таб-листа: отрицательный сдвиг равен её толщине
    bottom: components.tabs.activeBar.bottom,
    height: components.tabs.activeBar.height,

    backgroundColor: components.tabs.activeBar.background,
  },
}))
