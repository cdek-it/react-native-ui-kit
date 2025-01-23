import { IconStar, IconStarFilled } from '@tabler/icons-react-native'
import React, { memo, useMemo } from 'react'

import { makeStyles } from '../../utils/makeStyles'

import { RatingItemContainer, type RatingItemContainerProps } from './RatingItemContainer'

/**
 * Свойства компонента элемента рейтинга с иконкой звёздочки
 * @see RatingItemContainerProps - тип свойств компонента контейнера элемента от которого наследуется данный тип свойств
 * @see RatingItem - компонент элемента рейтинга с иконкой звёздочки
 */
export interface RatingItemProps extends Omit<RatingItemContainerProps, 'children'> {
  /**
   * Управление состоянием активности элемента
   */
  checked: boolean
}

/**
 * Компонент элемента рейтинга с иконкой звёздочки
 * @param checked - Управление состоянием активности элемента
 * @see RatingItemProps - тип свойств компонента
 * @see RatingItemContainer - компонент контейнер для элемента
 */
export const RatingItem = memo<RatingItemProps>(({ checked, ...rest }) => {
  const styles = useStyles()

  const Icon = useMemo(() => (checked ? IconStarFilled : IconStar), [checked])

  return (
    <RatingItemContainer {...rest}>
      {({ pressed, disabled }) => (
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
    </RatingItemContainer>
  )
})

const useStyles = makeStyles(({ theme, sizing }) => ({
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
