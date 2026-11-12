import { createContext } from 'react'
import type { View } from 'react-native'

export interface DialogHeaderAccessibility {
  title: string
  target: View | null
}

export const DialogAccessibilityContext = createContext<
  ((header: DialogHeaderAccessibility | null) => void) | null
>(null)
