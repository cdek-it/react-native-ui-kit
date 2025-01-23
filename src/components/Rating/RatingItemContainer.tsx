import React, { memo, type ReactNode } from 'react'
import { Pressable, type PressableProps } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

/**
 * Свойста компонента контейнера для элемента в компоненте рейтинга
 * @see RatingItemContainer
 */
export interface RatingItemContainerProps
  extends Omit<PressableProps, 'style' | 'onPress' | 'children'> {
  /**
   * Отображение элемента с паддингами
   * @default false
   */
  paddings?: boolean
  /**
   * Обработчик нажатия элемента
   * @default undefined
   */
  onPress?: () => void
  /**
   * Функция отображения дочернего компонента в контейнере
   * @param renderProps - свойства состояния контейнера для изменения отображения дочернего компонента
   * @returns отрендеренный компонент
   */
  children: (renderProps: { disabled: boolean | null; pressed: boolean }) => ReactNode
}

/**
 * Компонент контейнера для элемента в компоненте рейтинга
 * @param disabled - управление состоянием включённости компонента для нажатий пользователем
 * @param paddings - отображение элемента с паддингами
 * @param children - функция отображения дочернего компонента в контейнере
 * @see RatingItemContainerProps - тип свойств компонента
 * @see RatingItem - вариация компонента элемента рейтинга с иконкой звёздочки
 * @see RatingClear - вариация компонента элемента рейтинга с иконкой очистки
 */
export const RatingItemContainer = memo<RatingItemContainerProps>(
  ({ disabled = false, paddings = false, children, ...rest }) => {
    const styles = useStyles()

    return (
      <Pressable
        disabled={disabled}
        style={[styles.container, paddings && styles.containerWithPaddings]}
        {...rest}
      >
        {({ pressed }) => children({ disabled, pressed })}
      </Pressable>
    )
  }
)

const useStyles = makeStyles(({ theme, sizing }) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.Form.Rating.ratingIconFontSize,
    height: theme.Form.Rating.ratingIconFontSize,
  },

  containerWithPaddings: {
    width: sizing.Width['w-3'],
    height: sizing.Height['h-3'],
  },
}))
