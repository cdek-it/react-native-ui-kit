import { memo, useCallback, useMemo } from 'react'
import { type AccessibilityProps, View, type ViewProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { RatingClear } from './RatingClear'
import { RatingItem } from './RatingItem'

/**
 * Свойства компонента рейтинга
 * @see Rating - компонент рейтинга
 */
export interface RatingProps
  extends AccessibilityProps, Pick<ViewProps, 'testID'> {
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
  ({
    disabled = false,
    paddings = false,
    maxRating = 5,
    rating,
    onChange,
    onClear,
    testID,
    ...rest
  }) => {
    const handleItemPress = useCallback(
      (index: number) => () => {
        onChange(index + 1)
      },
      [onChange]
    )

    const renderArray = useMemo(
      () => Array.from({ length: maxRating }, (_, i) => `Rating-Item-${i}`),
      [maxRating]
    )

    return (
      <View style={styles.container}>
        <RatingClear
          disabled={disabled}
          paddings={paddings}
          testID={testID || 'RatingClear'}
          onPress={onClear}
          {...rest}
        />
        {renderArray.map((key, index) => (
          <RatingItem
            checked={index < rating}
            key={key}
            paddings={paddings}
            testID={`RatingItem-${index + 1}`}
            onPress={handleItemPress(index)}
          />
        ))}
      </View>
    )
  }
)

const styles = StyleSheet.create(({ theme }) => ({
  container: {
    flexDirection: 'row',
    gap: theme.General.inlineSpacing,
    alignItems: 'center',
  },
}))
