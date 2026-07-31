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
          uniProps={({ components }) => ({
            color: disabled
              ? components.rating.icon.color
              : pressed
                ? components.rating.icon.hoverColor
                : components.rating.icon.color,
          })}
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
