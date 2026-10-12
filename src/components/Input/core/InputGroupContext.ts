import { createContext } from 'react'

import type { InputState, InputTextSize } from './types'

export const InputGroupContext = createContext<{
  disabled: boolean
  size: InputTextSize
  state: InputState
  position: 'left' | 'right'
} | null>(null)
