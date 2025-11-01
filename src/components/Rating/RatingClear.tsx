import { IconBan } from '@tabler/icons-react-native'
import { memo } from 'react'

import { makeStyles } from '../../utils/makeStyles'

import {
  RatingItemContainer,
  type RatingItemContainerProps,
} from './RatingItemContainer'

/**
 * Свойства компонента элемента рейтинга для очистки рейтинга
 * @see RatingItemContainerProps - тип свойств компонента контейнера элемента от которого наследуется данный тип свойств
 * @see RatingClear = компонент элемента рейтинга для очистки рейтинга
 */
export interface RatingClearProps
  extends Omit<RatingItemContainerProps, 'children'> {}

/**
 * Компонент элемента рейтинга для очистки рейтинга
 * @see RatingClearProps - cвойства компонента элемента рейтинга для очистки рейтинга
 * @see RatingItemContainer - компонент контейнер для элемента
 */
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

const useStyles = makeStyles(({ theme }) => ({
  icon: {
    height: theme.Form.Rating.ratingIconFontSize,
    width: theme.Form.Rating.ratingIconFontSize,
    color: theme.Form.Rating.ratingCancelIconColor,
  },

  iconPressed: { color: theme.Form.Rating.ratingCancelIconHoverColor },

  iconDisabled: { color: theme.custom.rating.ratingCancelIconDisabledColor },
}))
