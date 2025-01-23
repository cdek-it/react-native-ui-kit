import { IconBan } from '@tabler/icons-react-native'
import React, { memo } from 'react'

import { makeStyles } from '../../utils/makeStyles'

import { RatingItemContainer, type RatingItemContainerProps } from './RatingItemContainer'

export interface RatingClearProps extends Omit<RatingItemContainerProps, 'children'> {}

export const RatingClear = memo<RatingClearProps>(({ ...rest }) => {
  const styles = useStyles()

  return (
    <RatingItemContainer {...rest}>
      {({ disabled, pressed }) => (
        <IconBan
          color={
            disabled
              ? styles.iconDisabled.color
              : pressed
                ? styles.iconPressed.color
                : styles.icon.color
          }
          height={styles.icon.height}
          width={styles.icon.width}
        />
      )}
    </RatingItemContainer>
  )
})

const useStyles = makeStyles(({ theme, sizing }) => ({
  icon: {
    height: theme.Form.Rating.ratingIconFontSize,
    width: theme.Form.Rating.ratingIconFontSize,
    color: theme.Form.Rating.ratingCancelIconColor,
  },

  iconPressed: {
    color: theme.Form.Rating.ratingCancelIconHoverColor,
  },

  iconDisabled: {
    color: theme.custom.rating.ratingCancelIconDisabledColor,
  },
}))
