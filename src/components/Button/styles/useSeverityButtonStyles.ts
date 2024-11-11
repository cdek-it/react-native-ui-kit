import { useMemo } from 'react'

import type { ButtonSeverityProps } from '../types'

import { useDangerButtonStyles } from './useDangerButtonStyles'
import { useHelpButtonStyles } from './useHelpButtonStyles'
import { useInfoButtonStyles } from './useInfoButtonStyles'
import { useSuccessButtonStyles } from './useSuccessButtonStyles'
import { useWarningButtonStyles } from './useWarningButtonStyles'

export const useSeverityButtonStyles = (severity: ButtonSeverityProps['severity']) => {
  const dangerButtonStyles = useDangerButtonStyles()
  const warningButtonStyles = useWarningButtonStyles()
  const helpButtonStyles = useHelpButtonStyles()
  const infoButtonStyles = useInfoButtonStyles()
  const successButtonStyles = useSuccessButtonStyles()

  return useMemo(() => {
    switch (severity) {
      case 'danger':
        return dangerButtonStyles
      case 'warning':
        return warningButtonStyles
      case 'help':
        return helpButtonStyles
      case 'info':
        return infoButtonStyles
      case 'success':
        return successButtonStyles
    }
  }, [
    dangerButtonStyles,
    helpButtonStyles,
    infoButtonStyles,
    severity,
    successButtonStyles,
    warningButtonStyles,
  ])
}
