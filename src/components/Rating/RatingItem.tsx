import { IconStar, IconStarFilled } from '@tabler/icons-react-native'
import { memo, useMemo } from 'react'

import { StyleSheet } from 'react-native-unistyles'

import { SvgUniversal } from '../../utils'

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
          uniProps={({ components }) => {
            const color = disabled
              ? checked
                ? components.rating.icon.activeColor
                : components.rating.icon.color
              : pressed
                ? components.rating.icon.hoverColor
                : checked
                  ? components.rating.icon.activeColor
                  : components.rating.icon.color

            return {
              color,
              fill: checked
                ? disabled
                  ? components.rating.icon.activeColor
                  : pressed
                    ? components.rating.icon.hoverColor
                    : components.rating.icon.activeColor
                : undefined,
            }
          }}
        />
      )}
    </RatingItemContainer>
  )
})

const styles = StyleSheet.create(({ components }) => ({
  icon: {
    height: components.rating.icon.size,
    width: components.rating.icon.size,
  },
}))
