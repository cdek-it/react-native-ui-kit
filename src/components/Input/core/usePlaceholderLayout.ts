import { useCallback, useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'

export const usePlaceholderLayout = () => {
  const [height, setHeight] = useState(0)
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height)
  }, [])

  return { minHeight: height, onLayout }
}
