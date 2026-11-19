import { useEffect, useState } from 'react'
import { Keyboard, Platform } from 'react-native'

export const useKeyboardFrame = () => {
  const [frame, setFrame] = useState(() => Keyboard.metrics())

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (event) =>
      setFrame(event.endCoordinates)
    )
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setFrame(undefined)
    )
    const change =
      Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardWillChangeFrame', (event) =>
            setFrame(event.endCoordinates)
          )
        : undefined

    return () => {
      show.remove()
      hide.remove()
      change?.remove()
    }
  }, [])

  return frame
}
