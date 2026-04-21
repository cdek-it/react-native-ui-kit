import { IconStar, IconStarFilled } from '@tabler/icons-react-native'
import { memo, useMemo } from 'react'

import { StyleSheet, SvgUniversal } from '../../utils'

import {
  RatingItemContainer,
  type RatingItemContainerProps,
} from './RatingItemContainer'

/**
 * Свойства компонента элемента рейтинга с иконкой звёздочки
 * @see RatingItemContainerProps - тип свойств компонента контейнера элемента от которого наследуется данный тип свойств
 * @see RatingItem - компонент элемента рейтинга с иконкой звёздочки
 */
export interface RatingItemProps extends Omit<
  RatingItemContainerProps,
  'children'
> {
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
  const Icon = useMemo(() => (checked ? IconStarFilled : IconStar), [checked])

  return (
    <RatingItemContainer {...rest}>
      {({ pressed, disabled }) => (
        <SvgUniversal
          {...styles.icon}
          fillOpacity={checked ? 1 : 0}
          source={Icon}
          uniProps={({ theme }) => {
            const color = disabled
              ? checked
                ? theme.custom.rating.ratingStarIconOnDisabledColor
                : theme.custom.rating.ratingStarIconOffDisabledColor
              : pressed
                ? theme.Form.Rating.ratingStarIconHoverColor
                : checked
                  ? theme.Form.Rating.ratingStarIconOnColor
                  : theme.Form.Rating.ratingStarIconOffColor

            return {
              color,
              fill: checked
                ? disabled
                  ? theme.custom.rating.ratingStarIconOnDisabledColor
                  : pressed
                    ? theme.Form.Rating.ratingStarIconHoverColor
                    : theme.Form.Rating.ratingStarIconOnColor
                : undefined,
            }
          }}
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
