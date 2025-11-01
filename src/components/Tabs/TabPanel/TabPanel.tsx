import { memo, type ReactNode } from 'react'
import { View } from 'react-native'

export interface TabPanelProps {
  /** Текущий активный индекс */
  activeIndex: number
  /** Индекс этой панели **/
  index: number
  children?: ReactNode
}

// Часть навигационного компонента Tabs
// Для упрощения связанного с табами контекста в верстке
//
export const TabPanel = memo<TabPanelProps>(
  ({ activeIndex, index, children, ...rest }) => {
    if (activeIndex !== index) {
      return null
    }

    return <View {...rest}>{children}</View>
  }
)
