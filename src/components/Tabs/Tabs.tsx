import React, { memo } from 'react'
import { View } from 'react-native'

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
              onPress={onChange}
            />
          )
        })}
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
}))
