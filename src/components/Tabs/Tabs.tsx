import React, { memo, type ReactNode } from 'react'
import { View } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

export interface TabsProps {
  /** Табы см. компонент TabItem */
  children?: ReactNode

  /** Текущий активный индекс */
  activeIndex: number

  /** Функция вызывается при нажатии на таб, при этом сам таб не переключается */
  onChange: (index: number) => void

  /** Признак доступности компонента */
  disabled?: boolean
}

export const TabsContext = React.createContext({
  disabled: false,
  activeIndex: 0,
  onChange: (index: number) => {
    // Default no-op implementation
  },
})
TabsContext.displayName = 'TabsContext'

/** Навигационный компонент Tabs
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=888-13076&t=hIQjdrqPKK8BWYev-4
 */
export const Tabs = memo<TabsProps>(
  ({ children, disabled = false, activeIndex, onChange, ...rest }) => {
    const styles = useStyles()

    return (
      <TabsContext.Provider value={{ disabled, activeIndex, onChange }}>
        <View {...rest} style={styles.container}>
          {children}
        </View>
      </TabsContext.Provider>
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
