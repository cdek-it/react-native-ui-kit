import React, { memo, useEffect, useRef } from 'react'
import { View } from 'react-native'
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated'

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

    const activeRef = useRef<View>(null)

    useEffect(() => {
      activeRef.current?.measure((x, y, width) => {
        lineWidth.value = withTiming(width)
        lineXPosition.value = withTiming(x)
      })
    }, [activeIndex])

    const lineWidth = useSharedValue(0)
    const lineXPosition = useSharedValue(0)

    return (
      <View {...rest} style={styles.container}>
        {items.map((prop, index) => {
          return (
            <TabItem
              {...prop}
              active={activeIndex === index}
              disabled={disabled}
              index={index}
              innerRef={activeIndex === index ? activeRef : undefined}
              key={prop.key}
              onPress={onChange}
            />
          )
        })}
        <Animated.View style={[styles.line, { width: lineWidth, left: lineXPosition }]} />
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
    zIndex: -1,
    bottom: 0,
    height: theme.Panel.TabView.tabviewHeaderBorderWidth,

    backgroundColor: theme.Panel.TabView.tabviewHeaderActiveBorderColor,
  },
}))
