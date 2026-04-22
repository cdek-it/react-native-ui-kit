import { IconBan } from '@tabler/icons-react-native'
import { memo } from 'react'

import { StyleSheet } from 'react-native-unistyles'

import { SvgUniversal } from '../../utils'

import {
  RatingItemContainer,
  type RatingItemContainerProps,
} from './RatingItemContainer'

/**
 * Свойства компонента элемента рейтинга для очистки рейтинга
 * @see RatingItemContainerProps - тип свойств компонента контейнера элемента от которого наследуется данный тип свойств
 * @see RatingClear = компонент элемента рейтинга для очистки рейтинга
 */
export interface RatingClearProps extends Omit<
  RatingItemContainerProps,
  'children'
> {}

/**
 * Компонент элемента рейтинга для очистки рейтинга
 * @see RatingClearProps - cвойства компонента элемента рейтинга для очистки рейтинга
 * @see RatingItemContainer - компонент контейнер для элемента
 */
export const RatingClear = memo<RatingClearProps>(({ ...rest }) => {
  return (
    <RatingItemContainer {...rest}>
      {({ disabled, pressed }) => (
        <SvgUniversal
          {...styles.icon}
          source={IconBan}
          uniProps={({ theme }) => ({
            color: disabled
              ? theme.custom.rating.ratingCancelIconDisabledColor
              : pressed
                ? theme.Form.Rating.ratingCancelIconHoverColor
                : theme.Form.Rating.ratingCancelIconColor,
          })}
        />
      )}
    </RatingItemContainer>
  )
})

const styles = StyleSheet.create(({ theme }) => ({
  icon: {
    height: theme.Form.Rating.ratingIconFontSize,
    width: theme.Form.Rating.ratingIconFontSize,
  },
}))
