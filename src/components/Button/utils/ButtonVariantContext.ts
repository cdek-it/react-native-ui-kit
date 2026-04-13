import { createContext } from 'react'

import type { ButtonSeverity, ButtonVariant } from '../types'

export interface ButtonVariantContextValue {
  variant: ButtonVariant
  severity?: ButtonSeverity
}

export const ButtonVariantContext = createContext<ButtonVariantContextValue>({
  variant: 'primary',
})
