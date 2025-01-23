import { IconStar, IconStarFilled } from '@tabler/icons-react-native'
import React, { memo, useMemo } from 'react'
import { Pressable, type PressableProps } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

export interface RatingItemProps extends Omit<PressableProps, 'style' | 'onPress'> {
  checked: boolean
  paddings?: boolean
  onPress?: () => void
}

export const RatingItem = memo<RatingItemProps>(
  ({ checked, paddings = false, disabled = false, onPress, ...rest }) => {
    const styles = useStyles()

    const Icon = useMemo(() => (checked ? IconStarFilled : IconStar), [checked])

    return (
      <Pressable
        disabled={disabled}
        style={[styles.container, paddings && styles.containerWithPaddings]}
        onPress={onPress}
        {...rest}
      >
        {({ pressed }) => (
          <Icon
            color={
              disabled
                ? checked
                  ? styles.iconCheckedDisabled.color
                  : styles.iconDisabled.color
                : pressed
                  ? styles.iconPressed.color
                  : checked
                    ? styles.iconChecked.color
                    : styles.icon.color
            }
            fill={
              checked
                ? disabled
                  ? styles.iconCheckedDisabled.color
                  : pressed
                    ? styles.iconPressed.color
                    : styles.iconChecked.color
                : undefined
            }
            fillOpacity={checked ? 1 : 0}
            height={styles.icon.height}
            width={styles.icon.width}
          />
        )}
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

  icon: {
    height: theme.Form.Rating.ratingIconFontSize,
    width: theme.Form.Rating.ratingIconFontSize,
    color: theme.Form.Rating.ratingStarIconOffColor,
  },

  iconPressed: {
    color: theme.Form.Rating.ratingStarIconHoverColor,
  },

  iconChecked: {
    color: theme.Form.Rating.ratingStarIconOnColor,
  },

  iconDisabled: {
    color: theme.custom.rating.ratingStarIconOffDisabledColor,
  },

  iconCheckedDisabled: {
    color: theme.custom.rating.ratingStarIconOnDisabledColor,
  },
}))
