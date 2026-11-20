import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'

export const useScreenReaderEnabled = () => {
  const [enabled, setEnabled] = useState<boolean>()
  useEffect(() => {
    let active = true
    let receivedEvent = false
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (value) => {
        receivedEvent = true
        setEnabled(value)
      }
    )
    void AccessibilityInfo.isScreenReaderEnabled().then((value) => {
      if (active && !receivedEvent) setEnabled(value)
    })

    return () => {
      active = false
      subscription.remove()
    }
  }, [])

  return enabled
}
