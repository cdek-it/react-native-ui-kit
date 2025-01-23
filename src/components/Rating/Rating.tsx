import React, { memo, useCallback } from 'react'
import { View } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

import { RatingClear } from './RatingClear'
import { RatingItem } from './RatingItem'

export interface RatingProps {
  disabled?: boolean
  paddings?: boolean
  maxRating?: number
  rating: number
  onChange: (rating: number) => void
  onClear: () => void
}

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
