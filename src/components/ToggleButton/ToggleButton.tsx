import type { Icon } from '@tabler/icons-react-native'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { Pressable, Text, View, type ViewStyle } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

import { useIconSize } from './hooks/useIconSize'
import { useLabelSize } from './hooks/useLabelSize'
import { useStateStyles } from './hooks/useStateStyles'

export interface ToggleButtonProps {
  /** Обработчик нажатия на кнопку */
  onPress: () => void
  /**
   * true, если необходим компонент в активном состоянии
   * @default false
   */
  checked?: boolean
  /**
   * Управление доступностью компонента
   * @default false
   */
  disabled?: boolean
  /** Отображение только иконки без текста */
  iconOnly?: boolean
  /**
   * Выбор позиции иконки. 'left' - иконка слева, 'right' - иконка справа, null - иконка скрыта
   * @default 'left'
   */
  iconPos?: 'left' | 'right' | null
  /** Текст на кнопке */
  label?: string
  /**
   * Выбор размера элемента
   * @default 'base'
   */
  size?: 'xlarge' | 'large' | 'base' | 'small'
  /** Дополнительная стилизация для контейнера компонента */
  style?: ViewStyle
  /** Иконка из библиотеки Tabler */
  Icon?: Icon
}

/**
 * Используется для выбора нескольких значений с помощью кнопки
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-4821
 */
export const ToggleButton = memo<ToggleButtonProps>(
  ({
    onPress,
    checked,
    disabled,
    iconOnly: iconOnlyProp,
    iconPos = 'left',
    label,
    size = 'base',
    style,
    Icon,
  }) => {
    const styles = useStyles()
    const labelSize = useLabelSize(size)
    const iconSize = useIconSize(size)
    const [pressed, setPressed] = useState(false)
    const stateStyles = useStateStyles(checked, disabled, pressed)

    const iconOnly = useMemo(() => iconOnlyProp || !label, [iconOnlyProp, label])

    const icon = useMemo(() => {
      if (!Icon) return null

      return (
        <Icon
          height={iconSize.height}
          style={stateStyles.label as ViewStyle}
          width={iconSize.width}
        />
      )
    }, [Icon, iconSize.height, iconSize.width, stateStyles.label])

    const onPressIn = useCallback(() => setPressed(true), [])
    const onPressOut = useCallback(() => setPressed(false), [])

    return (
      <Pressable
        disabled={disabled}
        style={[styles.container, style, stateStyles.borderContainer]}
        testID='ToggleButton_Pressable'
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View
          style={[
            styles.contentContainer,
            styles[size],
            iconOnly && styles.iconOnly,
            stateStyles.contentContainer,
          ]}
        >
          {iconOnly ? (
            icon
          ) : (
            <>
              {iconPos === 'left' && icon}
              <Text style={[styles.label, labelSize, stateStyles.label]}>{label}</Text>
              {Icon && iconPos === 'right' && icon}
            </>
          )}
        </View>
      </Pressable>
    )
  }
)

const useStyles = makeStyles(({ theme }) => ({
  container: {
    alignSelf: 'flex-start',
    borderRadius: 100,
    borderWidth: 1,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 100,
    paddingVertical: theme.Button.Common.buttonPaddingTopBottom,
    paddingHorizontal: 21,
    gap: 10.5,
  },
  xlarge: {
    minHeight: theme.Button.Common.buttonHeightXL,
  },
  large: {
    minHeight: theme.Button.Common.buttonHeightLG,
  },
  base: {
    minHeight: theme.Button.Common.buttonHeight,
    paddingHorizontal: theme.Button.Common.buttonPaddingLeftRight,
    gap: theme.General.inlineSpacing,
  },
  small: {
    minHeight: theme.Button.Common.buttonHeightSM,
    paddingHorizontal: 10.5,
    gap: theme.General.inlineSpacing,
  },
  iconOnly: {
    aspectRatio: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: 'center',
  },
  label: {
    flexShrink: 1,
  },
}))
