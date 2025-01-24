import React, { memo, useEffect, useState } from 'react'
import { type LayoutChangeEvent, type LayoutRectangle, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { makeStyles } from '../../utils/makeStyles'

import { TabItem, type TabItemProps } from './TabItem/TabItem'

export interface TabsProps {
  /** Список табов см. компонент TabItem */
  items: Array<Pick<TabItemProps, 'Icon' | 'label' | 'badge'> & { key: string }>

  /** Текущий активный индекс */
  activeIndex: number

  /** Функция вызывается при нажатии на таб, при этом сам таб не переключается */
  onChange: (index: number) => void

  /** Признак доступности компонента */
  disabled?: boolean
}

/** Навигационный компонент Tabs
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=888-13076&t=hIQjdrqPKK8BWYev-4
 */
export const Tabs = memo<TabsProps>(
  ({ items, disabled = false, activeIndex, onChange, ...rest }) => {
    const styles = useStyles()

    const [tabsLayouts, setTabsLayouts] = useState<Record<string, LayoutRectangle>>({})

    const lineSharedValue = useSharedValue({
      x: 0,
      width: 0,
    })

    const animatedStyles = useAnimatedStyle(() => {
      return {
        width: withTiming(lineSharedValue.value.width),
        left: withTiming(lineSharedValue.value.x),
      }
    })

    useEffect(() => {
      const activeLayout = tabsLayouts[items[activeIndex].key]
      if (activeLayout) {
        lineSharedValue.value = { width: activeLayout.width, x: activeLayout.x }
      }
    }, [activeIndex, tabsLayouts, lineSharedValue, items])

    const handleTabLayout = (e: LayoutChangeEvent, key: string) => {
      e.persist()

      setTabsLayouts((prevTabsLayouts) => {
        return {
          ...prevTabsLayouts,
          [key]: e.nativeEvent.layout,
        }
      })
    }

    return (
      <View {...rest} style={styles.container}>
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

const useStyles = makeStyles(({ theme }) => ({
  container: {
    flexDirection: 'row',
    gap: theme.Panel.TabView.tabviewHeaderSpacing,

    borderBottomWidth: 1,
    borderColor: theme.Panel.TabView.tabviewNavBorderColor,
  },
  line: {
    position: 'absolute',
    bottom: 0,
    height: theme.Panel.TabView.tabviewHeaderBorderWidth,

    backgroundColor: theme.Panel.TabView.tabviewHeaderActiveBorderColor,
  },
}))
