import { useMemo } from 'react'

import { makeStyles } from '../../../utils/makeStyles'
import type { ToggleButtonProps } from '../ToggleButton'

export const useLabelSize = (size: ToggleButtonProps['size'] = 'base') => {
  const styles = useStyles()

  return useMemo(() => {
    return [styles.common, styles[size]]
  }, [size, styles])
}

const useStyles = makeStyles(() => ({
  common: {
    fontWeight: '700',
    includeFontPadding: false,
    verticalAlign: 'middle',
  },
  xlarge: { fontSize: 21 },
  large: { fontSize: 17.5 },
  base: { fontSize: 14 },
  small: { fontSize: 12.25 },
}))
