import React, { memo, useCallback } from 'react'
import { View, type ViewProps } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

import { RatingClear } from './RatingClear'
import { RatingItem } from './RatingItem'

/**
 * Свойства компонента рейтинга
 * @see Rating - компонент рейтинга
 */
export interface RatingProps extends Pick<ViewProps, 'testID'> {
  /**
   * Управление состоянием включённости компонента для нажатий пользователем
   * @default false
   */
  disabled?: boolean
  /**
   * Отображение элемента с паддингами
   * @default false
   */
  paddings?: boolean
  /**
   * Максимальный рейтинг(количество звёздочек)
   * @default 5
   */
  maxRating?: number
  /**
   * Текущий рейтинг
   */
  rating: number
  /**
   * Обработчик изменения рейтинга
   * @param rating - новый рейтинг
   */
  onChange: (rating: number) => void
  /**
   * Обработчик очистки рейтинга
   */
  onClear: () => void
}

/**
 * Компонент рейтинга
 * @param disabled - управление состоянием включённости компонента для нажатий пользователем
 * @param paddings - отображение элемента с паддингами
 * @param maxRating - максимальный рейтинг(количество звёздочек)
 * @param rating - текущий рейтинг
 * @param onChange - обработчик изменения рейтинга
 * @param onClear - обработчик изменения рейтинга
 * @see RatingProps - тип свойств компонента рейтинга
 * @see RatingItem - элемент рейтинга с иконкой звёздочки
 * @see RatingClear - элемент рейтинга для очистки
 */
export const Rating = memo<RatingProps>(
  ({ disabled = false, paddings = false, maxRating = 5, rating, onChange, onClear }) => {
    const styles = useStyles()

    const handleItemPress = useCallback(
      (index: number) => () => {
        onChange(index + 1)
      },
      [onChange]
    )

    return (
      <View style={styles.container}>
        <RatingClear
          disabled={disabled}
          paddings={paddings}
          testID='RatingClear'
          onPress={onClear}
        />
        {new Array(maxRating).fill(null).map((_, index) => (
          <RatingItem
            checked={index < rating}
            // Использовать индекс массива в качестве ключа - единственно возможное и правильное решение
            // eslint-disable-next-line react/no-array-index-key
            key={`RatingItem-${index}`}
            paddings={paddings}
            testID={`RatingItem-${index + 1}`}
            onPress={handleItemPress(index)}
          />
        ))}
      </View>
    )
  }
)

const useStyles = makeStyles(({ theme }) => ({
  container: {
    flexDirection: 'row',
    gap: theme.General.inlineSpacing,
    alignItems: 'center',
  },
}))
