import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native'
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated'

import { makeStyles } from '../../utils/makeStyles'

/**
 * Тип свойств компонента ProgressBar
 * @see ProgressBar
 */
export interface ProgressBarProps extends Pick<ViewProps, 'testID'> {
  /**
   * Значение прогресса от 0 до 100
   */
  value: number
  /**
   * Отображение значения прогресса
   */
  showValue?: boolean
  /**
   * Стилизация компонента ProgressBar
   */
  style?: StyleProp<ProgressBarStyle>
}

/**
 * Компонент ProgressBar
 * @param value - значение прогресса от 0 до 100
 * @param showValue - отображение значения прогресса
 * @param style - стилизация компонента ProgressBar
 * @see ProgressBarProps
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-5024&m=dev
 */
export const ProgressBar = memo<ProgressBarProps>(
  ({ value: propsValue, showValue = false, style }) => {
    const styles = useStyles()

    const [containerWidth, setContainerWidth] = useState(0)
    const indicatorWidth = useSharedValue(0)

    const onLayout = useCallback(
      ({
        nativeEvent: {
          layout: { width },
        },
      }: LayoutChangeEvent) => {
        setContainerWidth(width)
      },
      []
    )

    const value = useMemo(() => {
      if (propsValue > 100) {
        return 100
      }

      if (propsValue < 0) {
        return 0
      }

      return propsValue
    }, [propsValue])

    useEffect(() => {
      indicatorWidth.value = withTiming(containerWidth * (value / 100))
    }, [containerWidth, indicatorWidth, value])

    return (
      <View
        style={[
          styles.container,
          style,
          showValue && styles.containerShowValue,
        ]}
        onLayout={onLayout}
      >
        <Animated.View style={[styles.indicator, { width: indicatorWidth }]}>
          {showValue ? (
            <Text style={styles.indicatorText}>{value} %</Text>
          ) : null}
        </Animated.View>
      </View>
    )
  }
)

const useStyles = makeStyles(({ theme, typography }) => ({
  container: {
    borderRadius: 100,
    backgroundColor: theme.Misc.ProgressBar.progressBarBg,
    overflow: 'hidden',
  },

  indicator: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.Misc.ProgressBar.progressBarValueBg,
    height: '100%',
    overflow: 'hidden',
  },

  containerShowValue: { height: theme.Misc.ProgressBar.progressBarHeight },

  indicatorText: {
    fontSize: typography.Size['text-xs'],
    textAlign: 'center',
    color: theme.Misc.ProgressBar.progressBarValueTextColor,
  },
}))

/**
 * Стиль компонента ProgressBar
 * @see ProgressBar
 */
export type ProgressBarStyle = Pick<
  ViewStyle,
  | 'height'
  | 'width'
  | 'maxWidth'
  | 'minWidth'
  | 'maxHeight'
  | 'minHeight'
  | 'flex'
  | 'alignSelf'
  | 'position'
  | 'top'
  | 'right'
  | 'left'
  | 'bottom'
  | 'margin'
  | 'marginBottom'
  | 'marginEnd'
  | 'marginHorizontal'
  | 'marginLeft'
  | 'marginRight'
  | 'marginStart'
  | 'marginTop'
  | 'marginVertical'
>
