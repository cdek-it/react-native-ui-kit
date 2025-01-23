import React, { memo, type ReactNode } from 'react'
import { Pressable, type PressableProps } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

export interface RatingItemContainerProps
  extends Omit<PressableProps, 'style' | 'onPress' | 'children'> {
  paddings?: boolean
  onPress?: () => void
  children: (renderProps: { disabled: boolean | null; pressed: boolean }) => ReactNode
}

export const RatingItemContainer = memo<RatingItemContainerProps>(
  ({ disabled = false, paddings = false, children, ...rest }) => {
    const styles = useStyles()

    return (
      <Pressable
        disabled={disabled}
        style={[styles.container, paddings && styles.containerWithPaddings]}
        {...rest}
      >
        {({ pressed }) => children({ disabled, pressed })}
      </Pressable>
    )
  }
)

const useStyles = makeStyles(({ theme, sizing }) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.Form.Rating.ratingIconFontSize,
    height: theme.Form.Rating.ratingIconFontSize,
  },

  containerWithPaddings: {
    width: sizing.Width['w-3'],
    height: sizing.Height['h-3'],
  },
}))
