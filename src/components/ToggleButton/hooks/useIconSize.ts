import { useMemo } from 'react'

import { makeStyles } from '../../../utils/makeStyles'
import type { ToggleButtonProps } from '../ToggleButton'

export const useIconSize = (size: ToggleButtonProps['size'] = 'base') => {
  const styles = useStyles()

  return useMemo(() => {
    return styles[size]
  }, [size, styles])
}

const useStyles = makeStyles(({ typography }) => ({
  xlarge: {
    width: typography.Size['text-4xl'],
    height: typography.Size['text-4xl'],
  },
  large: {
    width: typography.Size['text-2xl'],
    height: typography.Size['text-2xl'],
  },
  base: {
    width: typography.Size['text-xl'],
    height: typography.Size['text-xl'],
  },
  small: {
    width: typography.Size['text-base'],
    height: typography.Size['text-base'],
  },
}))
