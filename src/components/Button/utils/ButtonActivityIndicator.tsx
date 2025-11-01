import { memo } from 'react'
import { ActivityIndicator } from 'react-native'

import { makeStyles } from '../../../utils/makeStyles'

export const ButtonActivityIndicator = memo(() => {
  const styles = useStyles()

  return (
    <ActivityIndicator
      color={styles.activityIndicator.color}
      size={styles.activityIndicator.height}
      testID='Button_ActivityIndicator'
    />
  )
})

const useStyles = makeStyles(({ theme }) => ({
  activityIndicator: {
    color: theme.Button.Disabled.disabledButtonTextColor,
    height: 14,
  },
}))
